import fs from "fs";
import path from "path";
import OpenAI from "openai";

type CliOptions = {
  prompt?: string;
  output?: string;
  imagePath?: string;
};

function parseArgs(): CliOptions {
  const options: CliOptions = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if ((arg === "--prompt" || arg === "-p") && process.argv[i + 1]) {
      options.prompt = process.argv[++i];
    } else if ((arg === "--out" || arg === "-o") && process.argv[i + 1]) {
      options.output = process.argv[++i];
    } else if ((arg === "--image" || arg === "-i") && process.argv[i + 1]) {
      options.imagePath = process.argv[++i];
    }
  }
  return options;
}

function ensureOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set. Export it before running this script.");
  }
  return key;
}

function encodeImage(imagePath: string): string {
  const absolute = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(process.cwd(), imagePath);
  const data = fs.readFileSync(absolute);
  return Buffer.from(data).toString("base64");
}

function extractHtml(block: string): string {
  const fencedHtml = block.match(/```html\s*([\s\S]*?)```/i);
  if (fencedHtml?.[1]) return fencedHtml[1].trim();

  const fencedAny = block.match(/```\s*([\s\S]*?)```/);
  if (fencedAny?.[1]) return fencedAny[1].trim();

  return block.trim();
}

function writeOutput(html: string, outputPath?: string): string {
  const outputsDir = path.resolve(process.cwd(), "outputs");
  fs.mkdirSync(outputsDir, { recursive: true });
  const filename = outputPath ?? `website-${Date.now()}.html`;
  const absolute = path.isAbsolute(filename)
    ? filename
    : path.join(outputsDir, filename);
  fs.writeFileSync(absolute, html, "utf-8");
  return absolute;
}

async function main() {
  const { prompt, output, imagePath } = parseArgs();
  if (!prompt && !process.env.GPT5_WEBSITE_PROMPT) {
    console.error("Usage: npm run gpt5:site -- --prompt \"Landing page copy\" [--out hero.html] [--image path/to.png]");
    process.exit(1);
  }

  const resolvedPrompt = prompt ?? process.env.GPT5_WEBSITE_PROMPT!;
  const openai = new OpenAI({ apiKey: ensureOpenAIKey() });

  let input: unknown = resolvedPrompt;
  if (imagePath) {
    const encoded = encodeImage(imagePath);
    input = [
      {
        role: "user" as const,
        content: [
          { type: "input_text" as const, text: resolvedPrompt },
          {
            type: "input_image" as const,
            image_url: `data:image/${path.extname(imagePath).slice(1)};base64,${encoded}`,
            detail: "auto" as const,
          },
        ],
      },
    ];
  }

  const response = await openai.responses.create({
    model: "gpt-5",
    input,
  });

  const outputText = response.output_text ?? "";
  const html = extractHtml(outputText);
  const savedPath = writeOutput(html, output);
  console.log(`Saved GPT-5 generated markup to ${savedPath}`);
}

main().catch((err) => {
  console.error("[gpt5-webgen] failed:", err);
  process.exit(1);
});

