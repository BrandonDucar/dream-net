# ⚡ DreamNet Choreography: Google Workflows

We are adopting **Google Workflows** to orchestrate the DreamNet ecosystem. This replaces the need for a heavy Temporal cluster for our initial launch phase, leveraging GCP's native serverless orchestration.

## 🎯 Design Pattern: Fan-Out / Fan-In

As per the "Golden Path" architecture, we use a **Fan-Out / Fan-In** pattern to parallelize agent operations and aggregate results.

### 1. The Core Workflow (`main_orchestrator.yaml`)

```yaml
main:
  params: [input]
  steps:
    - init:
        assign:
          - project_id: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
          - location: "us-central1"
          - service_url: "https://api.dreamnet.ink"

    - fanout_agents:
        parallel:
          branches:
            - call_wolf_pack:
                steps:
                  - run_wolf:
                      call: http.post
                      args:
                        url: ${service_url + "/api/agents/wolf-pack/scan"}
                        auth:
                          type: OIDC
                      result: wolf_result
            - call_octopus:
                steps:
                  - run_octo:
                      call: http.post
                      args:
                        url: ${service_url + "/api/agents/octopus/balance"}
                        auth:
                          type: OIDC
                      result: octo_result
            - call_shield:
                steps:
                  - run_shield:
                      call: http.post
                      args:
                        url: ${service_url + "/api/shield/status"}
                        auth:
                          type: OIDC
                      result: shield_result

    - aggregate_results:
        assign:
          - final_status:
              wolf_pack: ${wolf_result.body}
              octopus: ${octo_result.body}
              shield: ${shield_result.body}
              timestamp: ${time.format(sys.now())}

    - return_result:
        return: ${final_status}
```

## 🚀 Deployment Strategy

1. **Define**: Save the YAML above to `infrastructure/google/workflows/main.yaml`.
2. **Deploy**:

    ```bash
    gcloud workflows deploy dreamnet-orchestrator \
      --source=infrastructure/google/workflows/main.yaml \
      --location=us-central1
    ```

3. **Execute**:

    ```bash
    gcloud workflows run dreamnet-orchestrator --location=us-central1
    ```

## 🛡️ Error Handling (The "Tripwires")

We wrap critical steps in `try/retry` blocks with exponential backoff to ensure **Durable Execution**.

```yaml
- call_critical_service:
    try:
      call: http.post
      args: ...
    retry:
      predicate: ${http.default_retry_predicate}
      max_retries: 5
      backoff:
        initial_delay: 1
        max_delay: 60
        multiplier: 2
```

---
*Status: Architecture Defined. Ready for scaffolding.*
