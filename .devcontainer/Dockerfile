ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ARG DEBIAN_FRONTEND=noninteractive

# install deno
ENV DENO_INSTALL=/usr/local
RUN /bin/bash -c "$(curl -fsSL https://deno.land/install.sh)" \
    && chown ${USER:-vscode} /usr/local/bin/deno

# update system packages, install gcc and git-extras, cleanup cache
RUN sudo apt-get -y update \
    && sudo apt-get -y install --no-install-recommends gcc git-extras \
    && sudo apt-get -y upgrade && sudo rm -rf /var/lib/apt/lists/*

RUN echo 'PATH="$HOMEBREW_PREFIX/bin:$PATH"; eval "$(brew shellenv 2>/dev/null)"; if command -v starship &>/dev/null || brew install starship 2>/dev/null; then eval "$(starship init bash)"; fi;' >> /home/${USER:-vscode}/.bashrc
