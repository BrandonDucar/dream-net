FROM otel/opentelemetry-collector:latest

COPY otel-collector.yaml /etc/otel-collector/config.yaml

EXPOSE 4317 4318

CMD ["--config=/etc/otel-collector/config.yaml"]

