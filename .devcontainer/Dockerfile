# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# update system packages and cleanup cache
ARG DEBIAN_FRONTEND=noninteractive
ARG USER=vscode

# install gcc, git-extras, gnu coreutils
RUN sudo apt-get -y update \
    && sudo apt-get -y install --no-install-recommends gcc git-extras coreutils \
    && sudo apt-get -y upgrade && sudo rm -rf /var/lib/apt/lists/*

# install latest deno and upgrade to canary
ENV DENO_INSTALL=/usr/local
ENV DENO_INSTALL_ROOT=/usr/local/bin
ENV PATH=${DENO_INSTALL_ROOT}:${PATH}

RUN curl -fsSL https://deno.land/install.sh | sudo sh \
    && chown ${USER} ${DENO_INSTALL_ROOT-}/deno \
    && ${DENO_INSTALL_ROOT-}/deno upgrade canary --output=${DENO_INSTALL_ROOT-}/deno

# install brew and add to path
ENV HOMEBREW_PREFIX=/home/linuxbrew/.linuxbrew
ENV PATH=${HOMEBREW_PREFIX}/bin:${PATH}

RUN echo 'export HOMEBREW_PREFIX="${HOMEBREW_PREFIX:-/home/linuxbrew/.linuxbrew}"; ' \
        'export HOMEBREW_BIN="${HOMEBREW_PREFIX}/bin/brew"; ' \
        'test -x "$HOMEBREW_PREFIX/bin/brew" || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; ' \
        'eval "$($HOMEBREW_BIN shellenv)"' >> /home/${USER}/.bashrc

# install starship and configure some defaults
RUN curl -fsSL https://starship.rs/install.sh | sh -s -- -y \
    && chown ${USER} /usr/local/bin/starship \
    && echo 'export STARSHIP_CONFIG="${HOME}/.config/starship.toml";' \
            'test -d "${HOME}/.config" || mkdir -p "${HOME}/.config";' \
            'test -f "${STARSHIP_CONFIG}" || starship preset -o "${STARSHIP_CONFIG}" tokyo-night;' \
            'eval "$(starship init bash)";'>> /home/${USER}/.bashrc

# install bash completions for deno
RUN sudo mkdir -p /etc/bash_completion.d && deno completions bash > /etc/bash_completion.d/deno.bash
