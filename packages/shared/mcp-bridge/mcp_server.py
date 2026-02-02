from fastapi import FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
import subprocess
import asyncio
import httpx
import time

load_dotenv()

app = FastAPI(title="DreamNet Synaptic Bridge (MCP)")

# In-memory store for telemetry (shared with Node.js organs via files or sockets)
TELEMETRY_PATH = "c:/dev/dream-net/telemetry.json"
BLACKBOARD_PATH = "c:/dev/dream-net/blackboard.md"

class CommandRequest(BaseModel):
    command: str
    args: list = []

@app.get("/health")
async def health():
    return {"status": "SYNCED", "nodes": 20, "organs": ["Nervous", "Digestive", "Integumentary"]}

@app.get("/blackboard")
async def get_blackboard():
    if os.path.exists(BLACKBOARD_PATH):
        with open(BLACKBOARD_PATH, "r", encoding="utf-8") as f:
            return {"content": f.read()}
    return {"error": "Blackboard offline"}

@app.get("/telemetry")
async def get_telemetry():
    if os.path.exists(TELEMETRY_PATH):
        with open(TELEMETRY_PATH, "r") as f:
            return json.load(f)
    return {"error": "Telemetry offline"}

async def push_telemetry_loop():
    """Background task to push local telemetry to Emergent.sh webhook."""
    webhook_url = os.getenv("EMERGENT_DASHBOARD_URL")
    if not webhook_url:
        print("Telemetry pusher: EMERGENT_DASHBOARD_URL not set in .env. Skipping push.")
        return

    target = f"{webhook_url}/api/bridge/telemetry/webhook"
    token = os.getenv("MCP_BRIDGE_TOKEN")

    print(f"Starting Telemetry Pusher -> {target}")
    
    async with httpx.AsyncClient() as client:
        while True:
            try:
                if os.path.exists(TELEMETRY_PATH):
                    with open(TELEMETRY_PATH, "r") as f:
                        data = json.load(f)
                    
                    response = await client.post(
                        target,
                        json=data,
                        headers={"Authorization": f"Bearer {token}"},
                        timeout=5.0
                    )
                    print(f"Telemetry Pushed: {response.status_code}")
                else:
                    print("Telemetry file missing, skipping cycle.")
            except Exception as e:
                print(f"Telemetry Push Error: {e}")
            
            await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(push_telemetry_loop())

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected")
    try:
        while True:
            if os.path.exists(TELEMETRY_PATH):
                with open(TELEMETRY_PATH, "r") as f:
                    data = json.load(f)
                await websocket.send_json(data)
            else:
                await websocket.send_json({"error": "Telemetry file missing"})
            await asyncio.sleep(1) # Frequency of heartbeat
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket Error: {e}")
        await websocket.close()

@app.post("/execute")
async def execute_command(request: CommandRequest, authorization: str = Header(None)):
    # Basic token-based security for the tunnel
    expected_token = os.getenv("MCP_BRIDGE_TOKEN")
    if authorization != f"Bearer {expected_token}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Example: Execute Optio vigor check
    if request.command == "optio-vigor":
        try:
            # Call the local Node.js script
            result = subprocess.check_output(["pnpm", "test:optio-vigor"], cwd="c:/dev/dream-net")
            return {"status": "SUCCESS", "output": result.decode()}
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    return {"status": "UNKNOWN_COMMAND"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
