"""
DreamNet Agent Client
Python client for ChatGPT Agent Mode and other integrations
"""

import os
import json
import time
from typing import Any, Dict, Optional, Union

import requests
from requests import Response, Session


DEFAULT_BASE_URL = "https://dreamnet.ink"


class DreamNetAgent:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = DEFAULT_BASE_URL,
        max_retries: int = 3,
        retry_base_delay_ms: int = 300,
        timeout_sec: int = 30,
        session: Optional[Session] = None,
    ) -> None:
        self.api_key = api_key or os.getenv("DREAMNET_API_KEY")
        if not self.api_key:
            raise ValueError("DREAMNET_API_KEY must be provided or set in env")

        self.base_url = base_url.rstrip("/")
        self.max_retries = max_retries
        self.retry_base_delay_ms = retry_base_delay_ms
        self.timeout_sec = timeout_sec
        self.session = session or requests.Session()

    # ------------ Low-level helpers ------------

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _request(
        self,
        method: str,
        path: str,
        body: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        url = f"{self.base_url}{path}"
        attempt = 0

        while True:
            try:
                resp: Response = self.session.request(
                    method=method,
                    url=url,
                    headers=self._headers(),
                    json=body,
                    params=params,
                    timeout=self.timeout_sec,
                )

                if resp.status_code in (429,) or resp.status_code >= 500:
                    if attempt < self.max_retries:
                        delay_ms = (
                            self.retry_base_delay_ms * (2 ** attempt)
                            + int(100 * (attempt + 1))
                        )
                        time.sleep(delay_ms / 1000)
                        attempt += 1
                        continue

                if not resp.ok:
                    raise RuntimeError(
                        f"DreamNet request failed {resp.status_code} {resp.reason}: "
                        f"{resp.text[:500]}"
                    )

                text = resp.text.strip()
                if not text:
                    return None

                try:
                    return resp.json()
                except json.JSONDecodeError as e:
                    raise RuntimeError(
                        f"DreamNet response not valid JSON for {method} {path}: {e}"
                    ) from e

            except (requests.Timeout, requests.ConnectionError) as e:
                if attempt < self.max_retries:
                    delay_ms = (
                        self.retry_base_delay_ms * (2 ** attempt)
                        + int(100 * (attempt + 1))
                    )
                    time.sleep(delay_ms / 1000)
                    attempt += 1
                    continue
                raise RuntimeError(f"DreamNet network error: {e}") from e

    def _get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        return self._request("GET", path, params=params)

    def _post(self, path: str, body: Optional[Dict[str, Any]] = None) -> Any:
        return self._request("POST", path, body=body)

    # ------------ Natural language interface ------------

    def get_context(self) -> Any:
        """GET /api/chatgpt-agent/context"""
        return self._get("/api/chatgpt-agent/context")

    def autonomous_query(
        self,
        message: str,  # DreamNet uses "message" not "prompt"
        session_id: Optional[str] = None,
        vars: Optional[Dict[str, Any]] = None,
        system_prompt: Optional[str] = None,
    ) -> Any:
        """POST /api/chatgpt-agent/chat"""
        body: Dict[str, Any] = {
            "message": message,  # DreamNet uses "message"
        }
        if session_id:
            body["sessionId"] = session_id
        if vars:
            body["vars"] = vars
        if system_prompt:
            body["systemPrompt"] = system_prompt
        return self._post("/api/chatgpt-agent/chat", body)

    # ------------ Common operations (mapped to actual DreamNet endpoints) ------------

    def check_system_status(self) -> Any:
        """Check DreamNet system status"""
        return self._get("/api/heartbeat")  # Actual endpoint

    def list_vercel_projects(self) -> Any:
        """List Vercel projects"""
        return self._get("/api/vercel/projects")

    def get_vercel_project(self, name: str) -> Any:
        """Get specific Vercel project"""
        return self._get(f"/api/vercel/project/{name}")

    def analyze_cleanup_opportunities(
        self,
        target_domain: Optional[str] = None,
    ) -> Any:
        """Analyze cleanup opportunities"""
        params: Dict[str, Any] = {}
        if target_domain:
            params["targetDomain"] = target_domain
        return self._get("/api/vercel/analyze", params=params)

    def execute_cleanup(
        self,
        actions: list,
        dry_run: bool = True,
    ) -> Any:
        """Execute cleanup actions"""
        return self._post("/api/vercel/cleanup", {"actions": actions, "dryRun": dry_run})

    def auto_cleanup(
        self,
        target_domain: Optional[str] = None,
        dry_run: bool = True,
    ) -> Any:
        """Auto-analyze and cleanup"""
        return self._post("/api/vercel/cleanup/auto", {
            "targetDomain": target_domain,
            "dryRun": dry_run
        })

    def get_shield_threats(
        self,
        limit: Optional[int] = None,
        since: Optional[str] = None,
    ) -> Any:
        """Get Shield threats"""
        params: Dict[str, Any] = {}
        if limit is not None:
            params["limit"] = limit
        if since is not None:
            params["since"] = since
        return self._get("/api/shield/threats", params=params)

    def get_shield_status(self) -> Any:
        """Get Shield Core status"""
        return self._get("/api/shield/status")

    def query_dreams(
        self,
        text: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> Any:
        """Query dreams"""
        params: Dict[str, Any] = {}
        if text is not None:
            params["text"] = text
        if limit is not None:
            params["limit"] = limit
        return self._get("/api/dreams", params=params)

    def get_dream(self, dream_id: str) -> Any:
        """Get specific dream by ID"""
        return self._get(f"/api/dreams/{dream_id}")

    def get_wolf_pack_opportunities(
        self,
        limit: Optional[int] = None,
        status: Optional[str] = None,
    ) -> Any:
        """Get Wolf Pack opportunities"""
        params: Dict[str, Any] = {}
        if limit is not None:
            params["limit"] = limit
        if status is not None:
            params["status"] = status
        return self._get("/api/wolf-pack/opportunities", params=params)

    def get_wolf_pack_status(self) -> Any:
        """Get Wolf Pack status"""
        return self._get("/api/wolf-pack/status")

    def get_spider_web_threads(
        self,
        limit: Optional[int] = None,
        kind: Optional[str] = None,
    ) -> Any:
        """Get Spider Web threads"""
        params: Dict[str, Any] = {}
        if limit is not None:
            params["limit"] = limit
        if kind is not None:
            params["kind"] = kind
        return self._get("/api/spider-web/threads", params=params)

    def get_dream_state_status(self) -> Any:
        """Get Dream State status"""
        return self._get("/api/dream-state/status")

    def validate_api_key(self) -> Any:
        """Validate API key"""
        return self._get("/api/keys/validate")

    def list_api_keys(self) -> Any:
        """List API keys"""
        return self._get("/api/keys")

    def get_system_state(self) -> Any:
        """Get system state"""
        return self._get("/api/system/state")

    def get_spider_web_status(self) -> Any:
        """Get Spider Web status"""
        return self._get("/api/system/spider")

    def get_shield_core_status(self) -> Any:
        """Get Shield Core status (system endpoint)"""
        return self._get("/api/system/shields")

    def get_control_plane_status(self) -> Any:
        """Get Control Plane status"""
        return self._get("/api/system/control")















