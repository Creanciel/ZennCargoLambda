FROM debian:bookworm-slim

ARG RUST_VERSION=1.86.0
ARG ZIG_VERSION=0.14.0

ENV HOME=/root \
    CARGO_HOME=/root/.cargo \
    RUSTUP_HOME=/root/.rustup \
    PKG_CONFIG_ALLOW_CROSS=1 \
    PATH="/root/.cargo/bin:/usr/local/zig:$PATH"

RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    make \
    perl \
    tar \
    xz-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -O "https://ziglang.org/download/$ZIG_VERSION/zig-linux-x86_64-$ZIG_VERSION.tar.xz" --output-dir /usr/local \
    && mkdir -p /usr/local/zig \
    && tar -Jxf "/usr/local/zig-linux-x86_64-$ZIG_VERSION.tar.xz" -C /usr/local/zig --strip-components=1 \
    && rm "/usr/local/zig-linux-x86_64-$ZIG_VERSION.tar.xz" \
    && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y

RUN rustup default "$RUST_VERSION" && \
    rustup target add aarch64-unknown-linux-musl && \
    cargo install cargo-lambda
