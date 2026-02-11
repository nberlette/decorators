import { lru } from "@decorators/lru";

export class RemoteService {
  constructor(
    protected baseUrl: string | URL,
    protected init?: RequestInit,
  ) {}

  @lru({
    transform: async (res) => (await res).clone(),
    ttl: 1e4, /* 10 seconds */
  })
  get(url?: string | URL, init?: RequestInit): Promise<Response> {
    url = new URL(url ?? "", this.baseUrl);
    init = { ...this.init, ...init, method: "GET" };
    return globalThis.fetch(url, init);
  }

  async getJson<T>(
    url?: string | URL,
    init?: RequestInit,
  ): Promise<{ headers: Headers; body: T }> {
    const res = await this.get(url, init);
    return { headers: res.headers, body: await res.json() as T };
  }
}

const api = new RemoteService(
  "https://jsonplaceholder.typicode.com/posts/1",
  { headers: { "Content-Type": "application/json" } },
);

type Post = { userId: number; id: number; title: string; body: string };

const post1 = await api.getJson<Post>(); // ~400ms (first fetch)
const post2 = await api.getJson<Post>(); // ~1ms (cached)

// wait a hair over 10s for the cache to become stale
await new Promise((r) => setTimeout(r, 10_010));

// ... wait >= 10s for the cache to expire ...
const post3 = await api.getJson<Post>(); // ~300ms (expired cache, new fetch)

// check that these are indeed from the same response object
console.assert(post1.headers.get("date") === post2.headers.get("date"));

// check that post3 is a new response from 10s later
console.assert(post1.headers.get("date") !== post3.headers.get("date"));
console.assert(post2.headers.get("date") !== post3.headers.get("date"));

// let's take it a step further and double-check the timestamps, just to be
// certain things are working as expected. post2 and post3 should have at least
// 10_000ms difference between their respective "Date" headers:
console.assert(
  Date.parse(post3.headers.get("date") ?? "") -
      Date.parse(post2.headers.get("date") ?? "") >= 1e4,
); // OK!
