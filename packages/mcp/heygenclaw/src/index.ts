import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createServer } from "http";

const API_KEY = process.env.HEYGEN_API_KEY ?? "";
const PORT = parseInt(process.env.PORT ?? "8093");
const BASE_URL = "https://api.heygen.com";

async function heygenRequest(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HeyGen API error ${res.status}: ${err}`);
  }
  return res.json();
}

const server = new McpServer({
  name: "heygenclaw",
  version: "1.0.0",
});

server.tool(
  "heygen_create_video_agent",
  "Generate an AI avatar video from a text prompt using the HeyGen Video Agent",
  {
    prompt: z.string().describe("Text prompt describing what the presenter should say and how"),
    title: z.string().optional().describe("Title for the video"),
    avatar_id: z.string().optional().describe("Avatar ID to use (omit for default)"),
    voice_id: z.string().optional().describe("Voice ID to use (omit for default)"),
  },
  async ({ prompt, title, avatar_id, voice_id }) => {
    const payload: Record<string, unknown> = { prompt };
    if (title) payload.title = title;
    if (avatar_id) payload.avatar_id = avatar_id;
    if (voice_id) payload.voice_id = voice_id;
    const result = await heygenRequest("/v2/video_agent", "POST", payload);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_create_avatar_video",
  "Create a scripted avatar video with a specific avatar, voice, and script",
  {
    script: z.string().describe("The script the avatar will speak"),
    avatar_id: z.string().describe("Avatar ID (use heygen_list_avatars to find one)"),
    voice_id: z.string().describe("Voice ID (use heygen_list_voices to find one)"),
    title: z.string().optional().describe("Video title"),
    width: z.number().optional().default(1280).describe("Video width in pixels"),
    height: z.number().optional().default(720).describe("Video height in pixels"),
  },
  async ({ script, avatar_id, voice_id, title, width, height }) => {
    const payload = {
      video_inputs: [{
        character: { type: "avatar", avatar_id, scale: 1.0 },
        voice: { type: "text", voice_id, input_text: script },
      }],
      title: title ?? "DreamNet Agent Video",
      dimension: { width: width ?? 1280, height: height ?? 720 },
    };
    const result = await heygenRequest("/v2/video/generate", "POST", payload);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_get_video",
  "Get the status and URL of a HeyGen video by its ID",
  {
    video_id: z.string().describe("The video ID returned from create_video_agent or create_avatar_video"),
  },
  async ({ video_id }) => {
    const result = await heygenRequest(`/v1/video_status.get?video_id=${video_id}`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_list_videos",
  "List recent videos on the HeyGen account",
  {
    limit: z.number().optional().default(10).describe("Number of videos to return"),
  },
  async ({ limit }) => {
    const result = await heygenRequest(`/v1/video.list?limit=${limit ?? 10}`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_delete_video",
  "Delete a HeyGen video by its ID",
  {
    video_id: z.string().describe("The video ID to delete"),
  },
  async ({ video_id }) => {
    const result = await heygenRequest(`/v1/video.delete?video_id=${video_id}`, "DELETE");
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "heygen_text_to_speech",
  "Generate speech audio from text using HeyGen TTS",
  {
    text: z.string().describe("The text to convert to speech"),
    voice_id: z.string().describe("Voice ID to use"),
    speed: z.number().optional().default(1.0).describe("Speech speed multiplier (0.5 to 2.0)"),
  },
  async ({ text, voice_id, speed }) => {
    const payload = {
      text,
      voice_id,
      speed: speed ?? 1.0,
    };
    const result = await heygenRequest("/v1/audio/tts", "POST", payload);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_list_voices",
  "List all available voices for TTS and avatar videos",
  {},
  async () => {
    const result = await heygenRequest("/v2/voices");
    const voices = result.data?.voices ?? result.data ?? [];
    const summary = Array.isArray(voices)
      ? voices.slice(0, 30).map((v: Record<string, unknown>) => ({
          voice_id: v.voice_id,
          name: v.display_name ?? v.name,
          language: v.language,
          gender: v.gender,
        }))
      : voices;
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
    };
  }
);

server.tool(
  "heygen_list_avatars",
  "List all available avatars",
  {},
  async () => {
    const result = await heygenRequest("/v2/avatars");
    const avatars = result.data?.avatars ?? result.data ?? [];
    const summary = Array.isArray(avatars)
      ? avatars.slice(0, 30).map((a: Record<string, unknown>) => ({
          avatar_id: a.avatar_id,
          name: a.avatar_name ?? a.name,
          gender: a.gender,
          preview_image_url: a.preview_image_url,
        }))
      : avatars;
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
    };
  }
);

server.tool(
  "heygen_translate_video",
  "Translate a video into another language using HeyGen Video Translation",
  {
    video_url: z.string().describe("URL of the source video to translate"),
    output_language: z.string().describe("Target language code (e.g. 'es', 'fr', 'zh', 'ja')"),
    title: z.string().optional().describe("Title for the translated video"),
  },
  async ({ video_url, output_language, title }) => {
    const payload: Record<string, unknown> = {
      video_url,
      output_language,
    };
    if (title) payload.title = title;
    const result = await heygenRequest("/v2/video_translate", "POST", payload);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result.data, null, 2),
      }],
    };
  }
);

server.tool(
  "heygen_account_status",
  "Get HeyGen account info and remaining balance",
  {},
  async () => {
    const result = await heygenRequest("/v2/user/me");
    return {
      content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
    };
  }
);

async function main() {
  const mode = process.argv[2] ?? "http";

  if (mode === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[heygenclaw] running in stdio mode");
    return;
  }

  const httpServer = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "heygenclaw", port: PORT }));
      return;
    }

    if (url.pathname === "/mcp" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const request = JSON.parse(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: { message: "Use stdio transport for full MCP" } }));
        } catch {
          res.writeHead(400);
          res.end("Bad request");
        }
      });
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  httpServer.listen(PORT, () => {
    console.log(`[heygenclaw] HTTP server running on port ${PORT}`);
    console.log(`[heygenclaw] Health: http://localhost:${PORT}/health`);
    console.log(`[heygenclaw] MCP endpoint: http://localhost:${PORT}/mcp`);
    console.log(`[heygenclaw] Remote MCP: https://mcp.heygen.com/mcp/v1/`);
  });
}

main().catch((err) => {
  console.error("[heygenclaw] Fatal error:", err);
  process.exit(1);
});
