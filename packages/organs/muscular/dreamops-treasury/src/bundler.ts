import axios from "axios";
import { UserOperation } from "./types.js";

export async function submitToBundler(cfg: any, userOp: UserOperation) {
  const apiKey = process.env[cfg.bundler.apiKeyEnv];
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

  const res = await axios.post(cfg.bundler.endpoint, { 
    id: 1,
    jsonrpc: "2.0",
    method: "eth_sendUserOperation",
    params: [userOp, cfg.chain.entryPoint]
  }, { headers });

  if (res.data?.error) {
    throw new Error(`Bundler submission failed: ${JSON.stringify(res.data.error)}`);
  }

  return res.data.result;
}
