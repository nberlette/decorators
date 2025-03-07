// deno-lint-ignore-file no-explicit-any
import { lru } from "jsr:@decorators/lru";
// using the `@std/cbor` module (compact binary object representation)
import { encodeCbor } from "jsr:@std/cbor";

// types for our geospatial service
export interface Review {
  user: string;
  rating: number;
  comment: string;
  price?: number;
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/** Business hours for a given day. Measured in 24-hour format. */
export interface Hours {
  open: number;
  close: number;
}

export interface Metadata {
  category?: string;
  hours?: Record<WeekDay, Hours | Hours[] | null>;
  reviews?: Review[];
  [key: string]: any;
}

export class Coordinate {
  constructor(
    public name: string,
    public latitude: number,
    public longitude: number,
  ) {}

  get distance(): number {
    return Math.sqrt(
      Math.pow(this.latitude, 2) + Math.pow(this.longitude, 2),
    );
  }

  toString(): string {
    return `${this.name} (${this.latitude}, ${this.longitude})`;
  }
}

export class GeoPoint extends Coordinate {
  constructor(
    public type: "restaurant" | "park" | "store" | "landmark",
    override name: string,
    override latitude: number,
    override longitude: number,
    public metadata?: Metadata,
  ) {
    super(name, latitude, longitude);
  }

  get rating(): number {
    return +(
      this.metadata?.reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0
    ) / (this.metadata?.reviews?.length ?? 1);
  }

  get price(): number {
    return this.metadata?.price ?? ((this.metadata?.reviews?.reduce(
      (sum, r) => sum + (r.price ?? 0),
      0,
    ) ?? 0) / (this.metadata?.reviews?.length ?? 1));
  }
}

export interface SearchFilters {
  name?: string;
  types?: GeoPoint["type"][];
  price?: [min: number, max: number];
  rating?: number;
  // Could have circular references or complex nested structures
  metadata?: Partial<Metadata>;
}

export class SpatialDatabase {
  constructor(
    protected data: GeoPoint[],
  ) {}

  // naive implementation of a custom keygen that can handle complex objects
  @lru({ key: (...a) => String.fromCharCode(...encodeCbor(a as any)) })
  // simulating an expensive geospatial querying operation
  query(
    location: Coordinate,
    radius_km: number,
    filters?: SearchFilters,
  ): GeoPoint[] {
    return this.data.filter((point) => {
      if (filters?.types && !filters.types.includes(point.type)) return false;
      if (filters?.name && !point.name.includes(filters.name)) return false;
      if ((filters?.rating ?? 0) > (point.rating ?? 0)) return false;
      if (filters?.price) {
        const [min, max] = filters.price;
        if (point.price < min || point.price > max) return false;
      }
      if (filters?.metadata) {
        for (const [k, v] of Object.entries(filters.metadata)) {
          const pv = point.metadata?.[k];
          if (typeof pv === "undefined") return typeof v === "undefined";
          if (typeof pv !== typeof v) return false;
          if (k === "reviews" && v.length !== pv.length) return false;
          if (typeof v === "object" && v != null) {
            if (JSON.stringify(pv) !== JSON.stringify(v)) return false;
          } else if (pv !== v) return false;
        }
      }
      // check if the point is within the radius of the location
      const a = point.distance, b = location.distance;
      const distance = Math.sqrt(Math.pow(a - b, 2));
      const distance_km = distance * 111.32; // convert to km
      return distance_km <= radius_km;
    });
  }
}

const db = new SpatialDatabase([
  new GeoPoint("restaurant", "Carmine's Pizza Henderson", 36.04142, 115.03036, {
    reviews: [
      { user: "Alice", rating: 5, comment: "Best pizza ever!" },
      { user: "Bob", rating: 4.25, comment: "Killer cannoli!" },
    ],
  }),
  new GeoPoint(
    "restaurant",
    "Raising Cane's Chicken Fingers",
    36.03504,
    115.04634,
    {
      reviews: [
        { user: "Charlie", rating: 4.5, comment: "Great chicken!" },
        { user: "Dave", rating: 4.75, comment: "Love the fries!" },
      ],
    },
  ),
  new GeoPoint("store", "Walmart Supercenter", 36.1699, 115.1398),
  new GeoPoint("landmark", "The Strip", 36.1147, 115.1728),
  new GeoPoint("park", "Red Rock Canyon", 36.1162, 115.4167),
  new GeoPoint("park", "Mount Charleston", 36.2784, 115.6405),
  new GeoPoint("landmark", "Fremont Street Experience", 36.1699, 115.1415),
  new GeoPoint("landmark", "Bellagio Fountains", 36.1126, 115.1767),
  new GeoPoint("landmark", "The Sphere", 36.12086, 115.16174),
]);

const home = new Coordinate("home", 36.033, -115.05);

const result1 = db.query(home, 5);
console.assert(result1.length === 2);

const result2 = db.query(home, 5, {
  name: "Carmine's Pizza Henderson",
  types: ["restaurant"],
});
console.assert(result2.length === 1);
