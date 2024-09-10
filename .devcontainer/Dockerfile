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
ENV DENO_INSTALL=/home/${USER}/.local DENO_INSTALL_ROOT=/home/${USER}/.local/bin
RUN curl -fsSL https://deno.land/install.sh | sh \
    && chown ${USER} ${DENO_INSTALL_ROOT-}/deno \
    && ${DENO_INSTALL_ROOT-}/deno upgrade canary

# install brew and add to path
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
    && echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/${USER}/.bashrc

# install starship and configure some defaults
RUN export BIN_DIR=/home/${USER}/.local/bin \
    && curl -fsSL https://starship.rs/install.sh | sh -s -- -y \
    && chown ${USER} /home/${USER}/.local/bin/starship \
    && { \
        echo 'export PATH="$HOME/.local/bin:$PATH";'; \
        echo 'export STARSHIP_CONFIG="${HOME}/.config/starship.toml";'; \
        echo 'test -d "${HOME}/.config" || mkdir -p "${HOME}/.config";'; \
        echo 'test -f "${STARSHIP_CONFIG}" || starship preset -o "${STARSHIP_CONFIG}" tokyo-night;'; \
        echo 'eval "$(starship init bash)";'; \
    } >> /home/${USER}/.bashrc

# install bash completions for deno
RUN sudo mkdir -p /etc/bash_completion.d \
    && /home/${USER}/.local/bin/deno completions bash > /etc/bash_completion.d/deno.bash
