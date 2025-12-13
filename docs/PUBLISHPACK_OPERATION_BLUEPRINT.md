# PublishPack - Complete Operation Blueprint

**Status**: 📋 Operation Blueprint  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Overview

**PublishPack** is a **packaging and staging agent** that prepares DreamNet papers and artifacts for multi-platform publishing. It handles everything up to the final "Publish / Submit / Mint" click.

### Core Principle

**PublishPack is NOT a writer** — it is a **packager + orchestrator**. It takes canonical source material and transforms it into platform-ready packages with clear instructions for manual publishing.

---

## Operation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PublishPack Agent                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Input      │→ │  Normalizer  │→ │   Router     │    │
│  │  Processor   │  │   & Validator │  │  (Platform)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘──────────────┘    │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           Platform Pack Modules                     │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │  │
│  │  │Arxiv │ │Zora  │ │GitHub│ │Web   │ │Medium│     │  │
│  │  │ Pack│ │Pack│ │Pack│ │Pack│ │Pack│ │Pack│     │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Manifest   │→ │   Registry   │→ │   Handoff    │    │
│  │   Generator  │  │   (State)    │  │  (Instructions)│    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Workflow

### Main Execution Flow

```
1. Receive Artifact Description
   ↓
2. Validate Input
   ↓
3. Load Canonical Source
   ↓
4. Normalize Source Format
   ↓
5. For Each Target Platform:
   ├─→ Run Platform Pack Module
   ├─→ Generate Platform-Specific Output
   └─→ Verify Bundle Integrity
   ↓
6. Generate Publish Manifest
   ↓
7. Register in Artifact Registry
   ↓
8. Return Manifest + Instructions
```

---

## Input Processing

### Input Validation Workflow

```typescript
interface ArtifactDescription {
  artifact_id: string;           // Required: Unique identifier
  title: string;                 // Required: Paper title
  authors: string[];            // Required: Array of authors
  abstract: string;             // Required: Abstract text
  canonical_source: {            // Required: Source file info
    format: "markdown" | "latex" | "pdf";
    location: string;            // File path or URL
  };
  tags?: string[];              // Optional: Tags for platforms
  primary_category?: string;    // Optional: arXiv category
  secondary_categories?: string[]; // Optional: Additional categories
  target_platforms: Platform[]; // Required: Platforms to generate
}

type Platform = 
  | "arxiv" 
  | "zora" 
  | "github" 
  | "website" 
  | "medium" 
  | "substack" 
  | "social";

// Validation Steps
async function validateInput(input: ArtifactDescription): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // Required fields
  if (!input.artifact_id) errors.push("Missing artifact_id");
  (!input.title) errors.push("Missing title");
  if (!input.authors || input.authors.length === 0) errors.push("Missing authors");
  if (!input.abstract) errors.push("Missing abstract");
  if (!input.canonical_source) errors.push("Missing canonical_source");
  if (!input.target_platforms || input.target_platforms.length === 0) {
    errors.push("Missing target_platforms");
  }
  
  // Format validation
  if (input.canonical_source.format && 
      !["markdown", "latex", "pdf"].includes(input.canonical_source.format)) {
    errors.push(`Invalid format: ${input.canonical_source.format}`);
  }
  
  // Platform validation
  const validPlatforms = ["arxiv", "zora", "github", "website", "medium", "substack", "social"];
  for (const platform of input.target_platforms) {
    if (!validPlatforms.includes(platform)) {
      errors.push(`Invalid platform: ${platform}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Source Loading Workflow

```typescript
async function loadCanonicalSource(
  source: CanonicalSource
): Promise<SourceContent> {
  // Determine source type
  if (source.location.startsWith("repo://")) {
    // Load from repository
    return await loadFromRepo(source.location);
  } else if (source.location.startsWith("http://") || source.location.startsWith("https://")) {
    // Load from URL
    return await loadFromURL(source.location);
  } else {
    // Load from local file system
    return await loadFromFileSystem(source.location);
  }
}

async function normalizeSource(
  content: SourceContent,
  format: string
): Promise<NormalizedSource> {
  switch (format) {
    case "markdown":
      return await normalizeMarkdown(content);
    case "latex":
      return await normalizeLaTeX(content);
    case "pdf":
      return await extractFromPDF(content);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
```

---

## Platform Pack Modules

### ArxivPack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Convert to LaTeX (if needed)
  ├─→ Markdown → LaTeX conversion
  └─→ Validate LaTeX syntax
  ↓
2. Compile to PDF
  ├─→ Run pdflatex
  ├─→ Handle bibliography (if needed)
  └─→ Verify PDF generation
  ↓
3. Create arXiv Bundle
  ├─→ Collect .tex file
  ├─→ Collect figures/ images
  ├─→ Collect .bbl/.bib files
  └─→ Create tar.gz archive
  ↓
4. Generate Metadata
  ├─→ Extract title, authors, abstract
  ├─→ Set categories
  └─→ Create metadata snippet
  ↓
5. Verify Bundle
  ├─→ Check file structure
  ├─→ Verify PDF compiles
  └─→ Validate archive integrity
  ↓
Output: ArxivPackage
```

**Implementation**:
```typescript
async function generateArxivPack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<ArxivPackage> {
  const buildDir = `build/${artifact.artifact_id}/arxiv`;
  await ensureDirectory(buildDir);
  
  // 1. Convert to LaTeX if needed
  let latexContent: string;
  if (source.format === "markdown") {
    latexContent = await convertMarkdownToLaTeX(source.content, artifact);
  } else if (source.format === "latex") {
    latexContent = source.content;
  } else {
    throw new Error("PDF source not supported for arXiv");
  }
  
  // 2. Write LaTeX file
  const texFile = `${buildDir}/dreamnet.tex`;
  await writeFile(texFile, latexContent);
  
  // 3. Compile PDF
  const pdfResult = await compileLaTeX(texFile, buildDir);
  if (!pdfResult.success) {
    throw new Error(`LaTeX compilation failed: ${pdfResult.error}`);
  }
  
  // 4. Collect files
  const files = await collectArxivFiles(buildDir);
  
  // 5. Create tarball
  const tarball = `${buildDir}/dreamnet.tar.gz`;
  await createTarball(tarball, files, buildDir);
  
  // 6. Generate metadata
  const metadata = {
    primary_category: artifact.primary_category || "cs.AI",
    secondary_categories: artifact.secondary_categories || [],
    title: artifact.title,
    abstract: artifact.abstract,
    authors: artifact.authors
  };
  
  return {
    status: "ready",
    bundle_path: tarball,
    notes: `Upload this .tar.gz to arXiv; select ${metadata.primary_category} primary${metadata.secondary_categories.length > 0 ? `, ${metadata.secondary_categories.join(", ")} secondary` : ""}.`,
    checklist: [
      "Log into arxiv.org",
      "Start new submission",
      "Upload tar.gz bundle",
      `Set primary category: ${metadata.primary_category}`,
      ...metadata.secondary_categories.map(cat => `Add secondary: ${cat}`),
      "Paste abstract from manifest",
      "Preview PDF and confirm"
    ],
    metadata
  };
}
```

### ZoraPack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Generate Cover Image
  ├─→ Create image prompt from title/abstract
  ├─→ Call VisionSmith or Grok/Sora
  └─→ Save cover image
  ↓
2. Prepare PDF
  ├─→ Ensure PDF exists
  └─→ Copy to Zora directory
  ↓
3. Generate Metadata
  ├─→ Create name (title)
  ├─→ Create description (abstract + details)
  ├─→ Set tags
  └─→ Suggest edition size
  ↓
4. Package Assets
  ├─→ Cover image
  ├─→ PDF
  └─→ Metadata JSON
  ↓
Output: ZoraPackage
```

**Implementation**:
```typescript
async function generateZoraPack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<ZoraPackage> {
  const buildDir = `build/${artifact.artifact_id}/zora`;
  await ensureDirectory(buildDir);
  
  // 1. Generate cover image
  const coverPrompt = `Create a cover image for a research paper titled "${artifact.title}". 
    Style: Academic, professional, modern. Include visual elements related to: ${artifact.tags?.join(", ") || "AI, blockchain"}.`;
  
  const coverImage = await VisionSmithAgent.run({
    task: "generate",
    data: {
      prompt: coverPrompt,
      style: "professional"
    }
  });
  
  const coverPath = `${buildDir}/cover_image.png`;
  await saveImage(coverImage.output.imageUrl, coverPath);
  
  // 2. Ensure PDF exists
  let pdfPath: string;
  if (source.format === "pdf") {
    pdfPath = source.location;
  } else {
    // Generate PDF from LaTeX or Markdown
    pdfPath = await generatePDF(source, buildDir);
  }
  const zoraPdfPath = `${buildDir}/paper.pdf`;
  await copyFile(pdfPath, zoraPdfPath);
  
  // 3. Generate metadata
  const metadata = {
    name: artifact.title,
    description: `${artifact.abstract}\n\nAuthors: ${artifact.authors.join(", ")}\n\nPublished by DreamNet Research Group.`,
    tags: artifact.tags || ["DreamNet", "AI", "multi-agent", "Base"],
    edition_size: suggestEditionSize(artifact)
  };
  
  return {
    status: "ready",
    assets: [coverPath, zoraPdfPath],
    metadata,
    notes: "Create new Zora mint; upload cover_image.png as primary visual, attach PDF as downloadable."
  };
}

function suggestEditionSize(artifact: ArtifactDescription): number {
  // Suggest edition size based on artifact type
  if (artifact.artifact_id.includes("paper")) {
    return 333; // Academic papers: 333 editions
  } else if (artifact.artifact_id.includes("whitepaper")) {
    return 1000; // Whitepapers: 1000 editions
  } else {
    return 500; // Default: 500 editions
  }
}
```

### GitHubPack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Prepare Files
  ├─→ PDF (if exists)
  ├─→ LaTeX source (if exists)
  └─→ README.md (generate)
  ↓
2. Generate README
  ├─→ Title + Abstract
  ├─→ Authors
  ├─→ Citation format
  └─→ Links (arXiv, Zora placeholders)
  ↓
3. Prepare Commit
  ├─→ Create commit message
  ├─→ Determine branch strategy
  └─→ Stage files
  ↓
4. Output Package Info
  ├─→ Repository path
  ├─→ Branch name
  ├─→ Files to add
  └─→ Commit message template
  ↓
Output: GitHubPackage
```

**Implementation**:
```typescript
async function generateGitHubPack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<GitHubPackage> {
  const buildDir = `build/${artifact.artifact_id}/github`;
  await ensureDirectory(buildDir);
  
  const versionDir = `${buildDir}/${artifact.artifact_id}`;
  await ensureDirectory(versionDir);
  
  const pathsAdded: string[] = [];
  
  // 1. Copy PDF if exists
  if (source.format === "pdf") {
    const pdfDest = `${versionDir}/${artifact.artifact_id}.pdf`;
    await copyFile(source.location, pdfDest);
    pathsAdded.push(`${artifact.artifact_id}/${artifact.artifact_id}.pdf`);
  } else {
    // Generate PDF
    const pdfPath = await generatePDF(source, versionDir);
    pathsAdded.push(`${artifact.artifact_id}/${path.basename(pdfPath)}`);
  }
  
  // 2. Copy LaTeX source if exists
  if (source.format === "latex" || source.format === "markdown") {
    const latexContent = source.format === "latex" 
      ? source.content 
      : await convertMarkdownToLaTeX(source.content, artifact);
    
    const texPath = `${versionDir}/${artifact.artifact_id}.tex`;
    await writeFile(texPath, latexContent);
    pathsAdded.push(`${artifact.artifact_id}/${artifact.artifact_id}.tex`);
  }
  
  // 3. Generate README.md
  const readme = generateREADME(artifact);
  const readmePath = `${versionDir}/README.md`;
  await writeFile(readmePath, readme);
  pathsAdded.push(`${artifact.artifact_id}/README.md`);
  
  // 4. Generate commit message
  const commitMessage = `Add ${artifact.artifact_id} (PDF + LaTeX + README)`;
  
  return {
    status: "ready",
    repo: "github.com/DreamNetHQ/papers",
    branch: "main",
    paths_added: pathsAdded,
    commit_message_template: commitMessage
  };
}

function generateREADME(artifact: ArtifactDescription): string {
  return `# ${artifact.title}

## Abstract

${artifact.abstract}

## Authors

${artifact.authors.map(a => `- ${a}`).join("\n")}

## Citation

\`\`\`bibtex
@article{dreamnet2025,
  title={${artifact.title}},
  author={${artifact.authors.join(" and ")}},
  year={2025},
  publisher={DreamNet Research Group}
}
\`\`\`

## Links

- arXiv: [Pending] <!-- Update after arXiv submission -->
- Zora: [Pending] <!-- Update after Zora mint -->
- Website: https://dreamnet.ink/papers/${artifact.artifact_id}

## License

[Specify license]
`;
}
```

### WebsitePack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Generate HTML Page
  ├─→ Title section
  ├─→ Authors section
  ├─→ Abstract section
  ├─→ Download PDF button
  └─→ Links section (arXiv, Zora placeholders)
  ↓
2. Generate Assets
  ├─→ Cover image (if available)
  └─→ Styling (CSS)
  ↓
3. Package Files
  ├─→ index.html
  ├─→ cover.png (if available)
  └─→ styles.css (optional)
  ↓
Output: WebsitePackage
```

**Implementation**:
```typescript
async function generateWebsitePack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<WebsitePackage> {
  const buildDir = `build/${artifact.artifact_id}/website`;
  await ensureDirectory(buildDir);
  
  // 1. Generate HTML page
  const html = generateHTMLPage(artifact, source);
  const htmlPath = `${buildDir}/index.html`;
  await writeFile(htmlPath, html);
  
  // 2. Copy cover image if available
  const files: string[] = [htmlPath];
  if (source.hasCoverImage) {
    const coverPath = `${buildDir}/cover.png`;
    await copyFile(source.coverImagePath, coverPath);
    files.push(coverPath);
  }
  
  return {
    status: "ready",
    route: `/papers/${artifact.artifact_id.replace(/_/g, "-")}`,
    files
  };
}

function generateHTMLPage(
  artifact: ArtifactDescription,
  source: NormalizedSource
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title} - DreamNet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #333; }
    .authors { color: #666; margin: 1rem 0; }
    .abstract { background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; }
    .download { display: inline-block; background: #0070f3; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; margin: 1rem 0; }
    .links { margin-top: 2rem; }
    .links a { margin-right: 1rem; color: #0070f3; }
  </style>
</head>
<body>
  <h1>${artifact.title}</h1>
  <div class="authors">
    <strong>Authors:</strong> ${artifact.authors.join(", ")}
  </div>
  <div class="abstract">
    <h2>Abstract</h2>
    <p>${artifact.abstract}</p>
  </div>
  <a href="/papers/${artifact.artifact_id}.pdf" class="download">Download PDF</a>
  <div class="links">
    <h3>Links</h3>
    <a href="#" id="arxiv-link">arXiv</a>
    <a href="#" id="zora-link">Zora</a>
    <a href="https://dreamnet.ink">DreamNet</a>
  </div>
  <script>
    // Update links after publishing (manual or via API)
    // document.getElementById('arxiv-link').href = 'https://arxiv.org/abs/...';
    // document.getElementById('zora-link').href = 'https://zora.co/collect/...';
  </script>
</body>
</html>`;
}
```

### MediumPack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Convert to HTML
  ├─→ Markdown → HTML conversion
  ├─→ Clean inline styles
  └─→ Preserve structure
  ↓
2. Inject Metadata
  ├─→ Headline (title)
  ├─→ Subtitle (1-line summary)
  └─→ Call-to-action (links)
  ↓
3. Format for Medium
  ├─→ Medium-compatible HTML
  ├─→ Image handling
  └─→ Link formatting
  ↓
Output: MediumPackage
```

**Implementation**:
```typescript
async function generateMediumPack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<MediumPackage> {
  const buildDir = `build/${artifact.artifact_id}/medium`;
  await ensureDirectory(buildDir);
  
  // 1. Convert to HTML
  let htmlContent: string;
  if (source.format === "markdown") {
    htmlContent = await convertMarkdownToHTML(source.content);
  } else if (source.format === "latex") {
    htmlContent = await convertLaTeXToHTML(source.content);
  } else {
    throw new Error("PDF source not supported for Medium");
  }
  
  // 2. Inject Medium-specific elements
  const mediumHTML = injectMediumElements(htmlContent, artifact);
  
  // 3. Save HTML file
  const htmlPath = `${buildDir}/${artifact.artifact_id}_medium.html`;
  await writeFile(htmlPath, mediumHTML);
  
  return {
    status: "ready",
    filename: htmlPath,
    notes: "Open Medium → New Story → Paste this HTML in code view. Images will auto-import."
  };
}

function injectMediumElements(
  html: string,
  artifact: ArtifactDescription
): string {
  const headline = `<h1>${artifact.title}</h1>`;
  const subtitle = `<p class="subtitle"><em>${artifact.abstract.split(".")[0]}.</em></p>`;
  
  const cta = `
<div class="cta">
  <p><strong>Learn more:</strong></p>
  <ul>
    <li><a href="https://dreamnet.ink">DreamNet Platform</a></li>
    <li><a href="#" id="arxiv-cta">Read on arXiv</a></li>
    <li><a href="#" id="zora-cta">Collect on Zora</a></li>
  </ul>
</div>`;
  
  return `${headline}\n${subtitle}\n\n${html}\n\n${cta}`;
}
```

### SocialLaunchPack Workflow

```
Input: NormalizedSource + ArtifactDescription
  ↓
1. Generate Caption Templates
  ├─→ X (Twitter) captions
  ├─→ Farcaster captions
  ├─→ Lens captions
  └─→ TikTok captions
  ↓
2. Generate Thread Templates
  ├─→ X thread (multi-tweet)
  ├─→ Farcaster thread
  └─→ Structured thread format
  ↓
3. Generate Quote Hooks
  ├─→ One-line quotes from abstract
  └─→ Key insights
  ↓
4. Generate Hashtags & Tags
  ├─→ Platform-specific hashtags
  └─→ Tag suggestions
  ↓
Output: SocialPackage
```

**Implementation**:
```typescript
async function generateSocialPack(
  source: NormalizedSource,
  artifact: ArtifactDescription
): Promise<SocialPackage> {
  // 1. Generate caption templates
  const captionTemplates = {
    twitter: generateTwitterCaption(artifact),
    farcaster: generateFarcasterCaption(artifact),
    lens: generateLensCaption(artifact),
    tiktok: generateTikTokCaption(artifact)
  };
  
  // 2. Generate thread templates
  const threadTemplates = {
    twitter: generateTwitterThread(artifact),
    farcaster: generateFarcasterThread(artifact)
  };
  
  // 3. Generate quote hooks
  const quoteHooks = extractQuoteHooks(artifact.abstract);
  
  // 4. Generate hashtags
  const hashtags = generateHashtags(artifact);
  
  return {
    status: "ready",
    caption_templates: Object.entries(captionTemplates).map(([platform, caption]) => ({
      platform,
      caption,
      hashtags: hashtags[platform] || []
    })),
    thread_templates: Object.entries(threadTemplates).map(([platform, threads]) => ({
      platform,
      threads
    })),
    quote_hooks: quoteHooks
  };
}

function generateTwitterCaption(artifact: ArtifactDescription): string {
  const firstSentence = artifact.abstract.split(".")[0];
  return `🚀 New paper: "${artifact.title}"\n\n${firstSentence}...\n\nRead more: [arXiv/Zora links]\n\n#DreamNet #AI #Web3`;
}

function generateTwitterThread(artifact: ArtifactDescription): string[] {
  return [
    `1/ ${artifact.title} 🧵\n\n${artifact.abstract.substring(0, 200)}...`,
    `2/ Key insights:\n\n${extractKeyInsights(artifact.abstract).join("\n\n")}`,
    `3/ Authors: ${artifact.authors.join(", ")}\n\nRead the full paper: [link]`,
    `4/ This paper introduces DreamNet's biomimetic architecture for AI + Web3 ecosystems.\n\nCollect on Zora: [link]`
  ];
}

function extractQuoteHooks(abstract: string): string[] {
  // Extract compelling quotes from abstract
  const sentences = abstract.split(".").filter(s => s.length > 20);
  return sentences.slice(0, 3).map(s => s.trim() + ".");
}

function generateHashtags(artifact: ArtifactDescription): Record<string, string[]> {
  const baseTags = artifact.tags || [];
  return {
    twitter: [...baseTags, "AI", "Web3", "Research"],
    farcaster: [...baseTags, "farcaster", "onchain"],
    lens: [...baseTags, "lens", "web3social"],
    tiktok: [...baseTags.slice(0, 3)] // Limit for TikTok
  };
}
```

---

## Manifest Generation Workflow

```
Input: All Platform Packages
  ↓
1. Aggregate Packages
  ├─→ Collect all platform outputs
  └─→ Verify all packages ready
  ↓
2. Generate Next Actions
  ├─→ Extract manual steps from each package
  └─→ Prioritize actions
  ↓
3. Create Manifest
  ├─→ Package all outputs
  ├─→ Add instructions
  └─→ Include warnings/notes
  ↓
4. Register in Registry
  ├─→ Create registry entry
  └─→ Set platform statuses
  ↓
Output: PublishManifest
```

**Implementation**:
```typescript
async function generateManifest(
  artifact: ArtifactDescription,
  packages: PlatformPackages
): Promise<PublishManifest> {
  // 1. Verify all packages
  const allReady = Object.values(packages).every(pkg => pkg.status === "ready");
  
  // 2. Generate next actions
  const nextActions = generateNextActions(packages);
  
  // 3. Create manifest
  const manifest: PublishManifest = {
    artifact_id: artifact.artifact_id,
    status: allReady ? "ready_for_manual_publish" : "partially_ready",
    packages,
    next_actions_for_human: nextActions
  };
  
  // 4. Register in registry
  await registerArtifact(artifact.artifact_id, manifest);
  
  return manifest;
}

function generateNextActions(packages: PlatformPackages): string[] {
  const actions: string[] = [];
  
  if (packages.arxiv) {
    actions.push("Upload arXiv tarball");
  }
  if (packages.zora) {
    actions.push("Mint Zora edition");
  }
  if (packages.github) {
    actions.push("Commit to GitHub repository");
  }
  if (packages.website) {
    actions.push("Deploy website page");
  }
  if (packages.medium) {
    actions.push("Publish Medium post");
  }
  if (packages.substack) {
    actions.push("Publish Substack post");
  }
  if (packages.social) {
    actions.push("Share URLs with SocialOpsBot for distribution");
  }
  
  return actions;
}
```

---

## Registry & State Management

### Registry Entry Workflow

```
1. Create Registry Entry
   ├─→ artifact_id
   ├─→ version
   ├─→ created_at
   └─→ platform_status (all "bundled")
   ↓
2. Store Entry
   ├─→ Save to registry store
   └─→ Generate registry ID
   ↓
3. Return Entry
```

**Implementation**:
```typescript
interface ArtifactRegistryEntry {
  artifact_id: string;
  version: string;
  created_at: string;
  platform_status: Record<Platform, "bundled" | `live:${string}` | "error">;
  manifest_path?: string;
}

async function registerArtifact(
  artifactId: string,
  manifest: PublishManifest
): Promise<ArtifactRegistryEntry> {
  const entry: ArtifactRegistryEntry = {
    artifact_id: artifactId,
    version: "1.0.0", // Could be extracted from artifact_id or input
    created_at: new Date().toISOString(),
    platform_status: {},
    manifest_path: `build/${artifactId}/manifest.json`
  };
  
  // Set initial platform statuses
  for (const platform of Object.keys(manifest.packages)) {
    entry.platform_status[platform as Platform] = "bundled";
  }
  
  // Save manifest
  await writeFile(entry.manifest_path, JSON.stringify(manifest, null, 2));
  
  // Save registry entry
  await ArtifactRegistry.store(entry);
  
  return entry;
}
```

### Status Update Workflow

```
Input: artifact_id + platform + URL
  ↓
1. Load Registry Entry
  ↓
2. Update Platform Status
  ├─→ Set status to "live:{url}"
  └─→ Update timestamp
  ↓
3. Save Updated Entry
  ↓
4. Trigger Downstream Actions
  ├─→ Update manifest with URLs
  └─→ Notify SocialOpsBot
```

**Implementation**:
```typescript
async function updatePlatformStatus(
  artifactId: string,
  platform: Platform,
  url: string
): Promise<void> {
  // Load registry entry
  const entry = await ArtifactRegistry.get(artifactId);
  if (!entry) {
    throw new Error(`Artifact not found: ${artifactId}`);
  }
  
  // Update platform status
  entry.platform_status[platform] = `live:${url}`;
  
  // Save updated entry
  await ArtifactRegistry.update(entry);
  
  // Update manifest with URL
  const manifest = await loadManifest(entry.manifest_path!);
  if (manifest.packages[platform]) {
    manifest.packages[platform].url = url;
    await saveManifest(manifest, entry.manifest_path!);
  }
  
  // Trigger downstream actions
  await triggerDownstreamActions(artifactId, platform, url);
}

async function triggerDownstreamActions(
  artifactId: string,
  platform: Platform,
  url: string
): Promise<void> {
  // If all platforms are live, trigger social distribution
  const entry = await ArtifactRegistry.get(artifactId);
  if (!entry) return;
  
  const allLive = Object.values(entry.platform_status).every(
    status => typeof status === "string" && status.startsWith("live:")
  );
  
  if (allLive) {
    // Trigger SocialOpsBot with social package
    const manifest = await loadManifest(entry.manifest_path!);
    if (manifest.packages.social) {
      await SocialOpsBot.schedule({
        artifact_id: artifactId,
        social_package: manifest.packages.social,
        urls: extractURLs(entry.platform_status)
      });
    }
  }
}
```

---

## Error Handling & Validation

### Error Handling Workflow

```
Error Occurs
  ↓
1. Classify Error
  ├─→ Source loading error
  ├─→ Conversion error
  ├─→ Platform generation error
  └─→ Validation error
  ↓
2. Handle Error
  ├─→ Log error with context
  ├─→ Attempt recovery (if possible)
  └─→ Mark package as "error"
  ↓
3. Continue or Fail
  ├─→ If critical: Fail entire operation
  └─→ If non-critical: Continue with other platforms
  ↓
4. Report in Manifest
  ├─→ Include error in manifest
  └─→ Provide error details
```

**Implementation**:
```typescript
async function handleError(
  error: Error,
  context: ErrorContext
): Promise<ErrorResult> {
  // Log error
  await AuditCore.log({
    type: "publishpack_error",
    artifact_id: context.artifact_id,
    platform: context.platform,
    error: error.message,
    stack: error.stack,
    timestamp: Date.now()
  });
  
  // Classify error
  const errorType = classifyError(error);
  
  // Attempt recovery
  if (errorType === "source_loading" && context.retryCount < 3) {
    return await retryWithBackoff(context);
  }
  
  // Mark package as error
  return {
    success: false,
    platform: context.platform,
    error: error.message,
    recoverable: errorType !== "critical"
  };
}

function classifyError(error: Error): ErrorType {
  if (error.message.includes("file not found") || error.message.includes("cannot read")) {
    return "source_loading";
  }
  if (error.message.includes("compilation") || error.message.includes("latex")) {
    return "conversion";
  }
  if (error.message.includes("validation") || error.message.includes("invalid")) {
    return "validation";
  }
  return "critical";
}
```

---

## Security & Guardrails

### Security Workflow

```
1. Input Validation
   ├─→ Sanitize file paths
   ├─→ Validate file types
   └─→ Check file sizes
   ↓
2. Sandbox Execution
   ├─→ Execute in isolated environment
   ├─→ Limit file system access
   └─→ Restrict network access
   ↓
3. Output Validation
   ├─→ Verify generated files
   ├─→ Check file integrity
   └─→ Validate manifest structure
   ↓
4. No Credential Storage
   ├─→ Never store API keys
   ├─→ Never store passwords
   └─→ Only prepare local files
```

**Implementation**:
```typescript
class PublishPackSecurity {
  async validateInput(input: ArtifactDescription): Promise<SecurityCheck> {
    // Sanitize file paths
    if (input.canonical_source.location.includes("..")) {
      throw new Error("Invalid file path: contains '..'");
    }
    
    // Validate file types
    const allowedFormats = ["markdown", "latex", "pdf"];
    if (!allowedFormats.includes(input.canonical_source.format)) {
      throw new Error(`Invalid format: ${input.canonical_source.format}`);
    }
    
    // Check file size (if loading from file)
    if (!input.canonical_source.location.startsWith("http")) {
      const stats = await stat(input.canonical_source.location);
      if (stats.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error("File too large: maximum 50MB");
      }
    }
    
    return { valid: true };
  }
  
  async executeInSandbox(
    operation: () => Promise<any>
  ): Promise<any> {
    // Execute in isolated environment
    // Limit file system access to build directory
    // Restrict network access (except for image generation)
    return await Sandbox.execute(operation, {
      allowedPaths: ["build/"],
      networkAccess: false,
      imageGeneration: true // Allow VisionSmith calls
    });
  }
}
```

---

## Integration Workflows

### Orchestrator Integration

```
Citadel/Orchestrator Calls PublishPack
  ↓
1. Validate Request
  ↓
2. Execute PublishPack
  ├─→ Load source
  ├─→ Generate packages
  └─→ Create manifest
  ↓
3. Publish Event
  ├─→ "publishpack_complete" event
  └─→ Include manifest in event
  ↓
4. Return Manifest
```

**Implementation**:
```typescript
// Integration with Orchestrator Core
export async function runPublishPackCycle(
  ctx: OrchestratorContext
): Promise<PublishPackStatus> {
  // Get pending artifacts from registry
  const pending = await ArtifactRegistry.getPending();
  
  for (const artifact of pending) {
    try {
      // Execute PublishPack
      const manifest = await PublishPackAgent.preparePublishBundle(artifact);
      
      // Publish event
      await NervousSystem.publish({
        topic: "task.complete",
        payload: {
          agent: "PublishPack",
          artifact_id: artifact.artifact_id,
          manifest
        }
      });
    } catch (error) {
      // Log error and continue
      await AuditCore.log({
        type: "publishpack_cycle_error",
        artifact_id: artifact.artifact_id,
        error: error.message
      });
    }
  }
  
  return { processed: pending.length };
}
```

### SocialOpsBot Integration

```
PublishPack Completes → URLs Live
  ↓
1. Check All Platforms Live
  ↓
2. Load Social Package
  ├─→ Caption templates
  ├─→ Thread templates
  └─→ Quote hooks
  ↓
3. Inject URLs
  ├─→ Replace placeholders with real URLs
  └─→ Update templates
  ↓
4. Schedule Posts
  ├─→ X posts
  ├─→ Farcaster casts
  └─→ Other platforms
```

**Implementation**:
```typescript
async function integrateWithSocialOpsBot(
  artifactId: string,
  urls: Record<Platform, string>
): Promise<void> {
  // Load manifest
  const manifest = await loadManifest(`build/${artifactId}/manifest.json`);
  
  if (!manifest.packages.social) {
    return; // No social package
  }
  
  // Inject URLs into templates
  const socialPackage = manifest.packages.social;
  const updatedTemplates = injectURLs(socialPackage, urls);
  
  // Schedule with SocialOpsBot
  await SocialOpsBot.schedule({
    artifact_id: artifactId,
    templates: updatedTemplates,
    schedule: "immediate" // Or scheduled time
  });
}

function injectURLs(
  socialPackage: SocialPackage,
  urls: Record<Platform, string>
): UpdatedTemplates {
  return {
    caption_templates: socialPackage.caption_templates.map(template => ({
      ...template,
      caption: template.caption
        .replace("[arXiv link]", urls.arxiv || "[arXiv link]")
        .replace("[Zora link]", urls.zora || "[Zora link]")
    })),
    thread_templates: socialPackage.thread_templates.map(template => ({
      ...template,
      threads: template.threads.map(thread =>
        thread
          .replace("[link]", urls.arxiv || "[link]")
          .replace("[Zora link]", urls.zora || "[Zora link]")
      )
    }))
  };
}
```

---

## Complete Operation Blueprint

### End-to-End Workflow

```
1. INPUT PHASE
   ├─→ Receive ArtifactDescription
   ├─→ Validate input structure
   └─→ Check required fields
   ↓
2. SOURCE PHASE
   ├─→ Load canonical source
   ├─→ Normalize format
   └─→ Validate source integrity
   ↓
3. PACKAGING PHASE
   ├─→ For each target_platform:
   │   ├─→ Run platform pack module
   │   ├─→ Generate platform-specific output
   │   ├─→ Verify bundle integrity
   │   └─→ Collect package output
   └─→ Handle errors (continue on non-critical)
   ↓
4. MANIFEST PHASE
   ├─→ Aggregate all packages
   ├─→ Generate next actions
   ├─→ Create publish manifest
   └─→ Validate manifest structure
   ↓
5. REGISTRY PHASE
   ├─→ Create registry entry
   ├─→ Set platform statuses to "bundled"
   ├─→ Save manifest to disk
   └─→ Store registry entry
   ↓
6. OUTPUT PHASE
   ├─→ Return manifest
   ├─→ Log completion
   └─→ Publish completion event
```

---

## Implementation Checklist

### Phase 1: Core Infrastructure

- [ ] Create `packages/publishpack-agent/` package
- [ ] Implement input validation
- [ ] Implement source loading
- [ ] Implement source normalization
- [ ] Create registry system

### Phase 2: Platform Packs

- [ ] Implement ArxivPack
- [ ] Implement GitHubPack
- [ ] Implement WebsitePack
- [ ] Implement MediumPack
- [ ] Implement SubstackPack

### Phase 3: Enhanced Packs

- [ ] Implement ZoraPack (with VisionSmith integration)
- [ ] Implement SocialLaunchPack

### Phase 4: Integration

- [ ] Integrate with Orchestrator Core
- [ ] Integrate with SocialOpsBot
- [ ] Integrate with VisionSmith (for cover images)
- [ ] Integrate with Audit Core

### Phase 5: Testing & Optimization

- [ ] Test all platform packs
- [ ] Test error handling
- [ ] Test registry updates
- [ ] Optimize performance

---

**Status**: 📋 Complete Operation Blueprint

