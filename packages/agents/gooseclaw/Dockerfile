FROM ghcr.io/block/goose:latest

USER root

# Install extra tools useful for DreamNet agent tasks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    jq \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

USER goose

# Bake DreamNet config so goose starts pre-wired to openclaw extensions
RUN mkdir -p /home/goose/.config/goose
COPY --chown=goose:goose goose-config.yaml /home/goose/.config/goose/config.yaml

WORKDIR /workspace

# Default: interactive session. Override with:
#   docker exec -it dreamnet_gooseclaw goose run -t "your task"
ENTRYPOINT ["goose"]
CMD ["session"]
