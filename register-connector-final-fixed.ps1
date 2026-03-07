$connectorConfig = @{
    "name" = "dreamnet-postgres-connector"
    "config" = @{
        "connector.class" = "io.debezium.connector.postgresql.PostgresConnector"
        "database.hostname" = "clawedette_db"
        "database.port" = "5432"
        "database.user" = "debezium"
        "database.password" = "debezium_password_123"
        "database.dbname" = "dreamnet_vectors"
        "database.server.name" = "dreamnet_postgres"
        "topic.prefix" = "dreamnet"
        "schema.include.list" = "public"
        "table.include.list" = "public.documents"
        "plugin.name" = "pgoutput"
        "publication.name" = "dreamnet_publication"
        "slot.name" = "dreamnet_slot"
    }
}

$json = $connectorConfig | ConvertTo-Json -Depth 10
Write-Host "Registering fixed Debezium connector..."
Invoke-RestMethod -Uri "http://localhost:8083/connectors" -Method Post -Body $json -ContentType "application/json" -ErrorAction Stop | ConvertTo-Json
