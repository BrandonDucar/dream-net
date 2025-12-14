# PublishPack Agent - Complete Documentation

**Package**: `agents/PublishPack`  
**Type**: System / Coordinator Agent  
**Status**: 📋 Documented (Implementation Pending)  
**Last Updated**: 2025-01-27

---

## Overview

**PublishPack** is a **packager and orchestrator agent** that prepares, packages, and stages DreamNet papers and major artifacts for publishing across multiple platforms. It handles everything up to the final "Publish / Submit / Mint" click, but does not execute the final publication step itself.

### Key Features

- **Multi-Platform Packaging**: Generate platform-specific variants for arXiv, Zora, GitHub, websites, Medium/Substack, and social platforms
- **Automated Bundle Creation**: Assemble submission packages with metadata and descriptions
- **Platform-Specific Optimization**: Tailor content format and structure for each platform
- **Human-Friendly Instructions**: Provide clear "click here and upload this file" instructions
- **Downstream Integration**: Trigger amplification agents after URLs are live
- **Registry Tracking**: Track publish status across all platforms
- **Security-First**: Never stores credentials; only prepares local files

---

## Role & Responsibilities

### Role

PublishPack is **not a writer**—it is a **packager + orchestrator**. It takes canonical source material and transforms it into platform-ready packages.

### Responsibilities

For any given artifact (e.g., the DreamNet paper), PublishPack:

1. **Takes the canonical source** (Markdown / LaTeX / PDF)
2. **Generates all platform-specific variants**
3. **Assembles submission packages**
4. **Writes metadata + descriptions**
5. **Hands off final bundles** with clear "click here and upload this file" instructions
6. **Triggers downstream amplification agents** after URLs are live

---

## Supported Platforms

### Initial Set

- **arXiv**: Academic paper submission (LaTeX/PDF bundles)
- **Zora**: NFT/collectible minting (cover image + PDF + metadata)
- **GitHub**: Repository + release (PDF, LaTeX, README)
- **Static Site / Docs Site**: Vercel / GitHub Pages (HTML landing page)
- **Medium / Substack**: Blog post format (HTML conversion)
- **Social Broadcast**: Delegated to SocialOpsBot / RelayBot (caption templates, thread templates)

---

## Inputs

PublishPack expects a structured **artifact description** as input:

```typescript
interface ArtifactDescription {
  artifact_id: string; // Unique key across DreamNet
  title: string;
  authors: string[];
  abstract: string;
  canonical_source: {
    format: "markdown" | "latex" | "pdf";
    location: string; // e.g., "repo://dreamnet/papers/dreamnet_v1.md"
  };
  tags: string[]; // Used across blog / Zora / social
  primary_category: string; // arXiv category, e.g., "cs.AI"
  secondary_categories?: string[]; // e.g., ["cs.MA"]
  target_platforms: Platform[]; // What to generate this run
}

type Platform = "arxiv" | "zora" | "github" | "website" | "medium" | "substack" | "social";
```

### Example Input

```json
{
  "artifact_id": "dreamnet_paper_v1",
  "title": "DreamNet: A Self-Evolving Multi-Agent Ecosystem",
  "authors": [
    "Brandon Ducar",
    "DreamNet Research Group"
  ],
  "abstract": "DreamNet is a self-evolving multi-agent ecosystem...",
  "canonical_source": {
    "format": "markdown",
    "location": "repo://dreamnet/papers/dreamnet_v1.md"
  },
  "tags": ["DreamNet", "multi-agent", "Base", "AI ecosystems"],
  "primary_category": "cs.AI",
  "secondary_categories": ["cs.MA"],
  "target_platforms": [
    "arxiv",
    "zora",
    "github",
    "website",
    "medium",
    "substack"
  ]
}
```

---

## Outputs

PublishPack returns a **publish manifest** describing everything it prepared:

```typescript
interface PublishManifest {
  artifact_id: string;
  status: "ready_for_manual_publish" | "partially_ready" | "error";
  packages: {
    arxiv?: ArxivPackage;
    zora?: ZoraPackage;
    github?: GitHubPackage;
    website?: WebsitePackage;
    medium?: MediumPackage;
    substack?: SubstackPackage;
    social?: SocialPackage;
  };
  next_actions_for_human: string[];
  errors?: string[];
}

interface ArxivPackage {
  status: "ready" | "error";
  bundle_path: string; // e.g., "build/dreamnet_paper_v1/arxiv/dreamnet.tar.gz"
  notes: string;
  checklist: string[];
}

interface ZoraPackage {
  status: "ready" | "error";
  assets: string[]; // Cover image, PDF, etc.
  metadata: {
    name: string;
    description: string;
    tags: string[];
    edition_size: number;
  };
  notes: string;
}

interface GitHubPackage {
  status: "ready" | "error";
  repo: string;
  branch: string;
  paths_added: string[];
  commit_message_template: string;
}

interface WebsitePackage {
  status: "ready" | "error";
  route: string;
  files: string[];
}

interface MediumPackage {
  status: "ready" | "error";
  filename: string;
  notes: string;
}

interface SocialPackage {
  status: "ready" | "error";
  caption_templates: {
    platform: string;
    caption: string;
    hashtags: string[];
  }[];
  thread_templates: {
    platform: string;
    threads: string[];
  }[];
  quote_hooks: string[];
}
```

### Example Output

```json
{
  "artifact_id": "dreamnet_paper_v1",
  "status": "ready_for_manual_publish",
  "packages": {
    "arxiv": {
      "status": "ready",
      "bundle_path": "build/dreamnet_paper_v1/arxiv/dreamnet.tar.gz",
      "notes": "Upload this .tar.gz to arXiv; select cs.AI primary, cs.MA secondary.",
      "checklist": [
        "Log into arxiv.org",
        "Start new submission",
        "Upload tar.gz bundle",
        "Set primary category: cs.AI",
        "Add secondary: cs.MA",
        "Paste abstract from manifest",
        "Preview PDF and confirm"
      ]
    },
    "zora": {
      "status": "ready",
      "assets": [
        "build/dreamnet_paper_v1/zora/cover_image.png",
        "build/dreamnet_paper_v1/zora/paper.pdf"
      ],
      "metadata": {
        "name": "DreamNet: A Self-Evolving Multi-Agent Ecosystem",
        "description": "The foundational paper introducing DreamNet...",
        "tags": ["DreamNet", "AI", "multi-agent", "Base"],
        "edition_size": 333
      },
      "notes": "Create new Zora mint; upload cover_image.png as primary visual, attach PDF as downloadable."
    },
    "github": {
      "status": "ready",
      "repo": "github.com/DreamNetHQ/papers",
      "branch": "main",
      "paths_added": [
        "dreamnet_v1/dreamnet_v1.pdf",
        "dreamnet_v1/dreamnet_v1.tex",
        "dreamnet_v1/README.md"
      ],
      "commit_message_template": "Add DreamNet paper v1 (PDF + LaTeX + README)"
    },
    "website": {
      "status": "ready",
      "route": "/papers/dreamnet-v1",
      "files": [
        "build/dreamnet_paper_v1/site/index.html",
        "build/dreamnet_paper_v1/site/cover.png"
      ]
    },
    "medium": {
      "status": "ready",
      "filename": "build/dreamnet_paper_v1/medium/dreamnet_v1_medium.html",
      "notes": "Paste this HTML into Medium's editor; images will auto-import."
    }
  },
  "next_actions_for_human": [
    "Upload arXiv tarball",
    "Mint Zora edition",
    "Publish Medium post",
    "Share URLs with SocialOpsBot"
  ]
}
```

---

## Internal Modules

PublishPack is composed of platform-specific pack modules:

### 5.1 ArxivPack

**Tasks**:
1. Convert Markdown → LaTeX (if needed)
2. Generate arXiv-compliant LaTeX structure
3. Create tarball with required files:
   - `dreamnet.tex` (main LaTeX file)
   - `dreamnet.bbl` (bibliography, if needed)
   - Any figures/images
4. Validate arXiv requirements (file size, format, etc.)
5. Generate submission checklist

**Output**: `packages.arxiv` in manifest

### 5.2 ZoraPack

**Tasks**:
1. Generate cover image prompt + export (delegates to Grok/Sora or another agent)
2. Package:
   - Cover image
   - PDF
   - Short description
   - Long description
   - Tags
3. Suggest edition size + mint config

**Output**: `packages.zora` in manifest

### 5.3 GitHubPack

**Tasks**:
1. Place files:
   - PDF
   - LaTeX source
   - README.md (with abstract + citation)
2. Write commit message template
3. Either create a PR branch or commit directly (depending on repo policy)

**Output**: `packages.github` in manifest

### 5.4 WebsitePack

**Tasks**:
1. Build simple paper landing page:
   - Title
   - Abstract
   - Author list
   - "Download PDF" button
   - Links to arXiv + Zora (placeholders until URLs known)
2. Output:
   - `index.html` (or React page code)
   - Any assets

**Output**: `packages.website` in manifest

### 5.5 Medium / Substack Pack

**Tasks**:
1. Convert canonical Markdown → HTML (clean, no weird inline styles)
2. Inject:
   - Headline
   - Subtitle (1-line summary)
   - Call-to-action (links to DreamNet, arXiv, Zora)
3. Output HTML file + short note

**Output**: `packages.medium` and `packages.substack` in manifest

### 5.6 SocialLaunchPack (Optional)

**Tasks**:
1. Prepare (not directly post):
   - X / Farcaster / Lens / TikTok caption templates
   - Thread templates summarizing the paper
   - One-line quote hooks
   - Hashtag + tag suggestions
2. Output JSON blob of "posts" that SocialOpsBot can schedule

**Output**: `packages.social` in manifest

---

## Invocation Pattern

Any orchestrator (DreamAgent, Citadel, Cursor agent) can call PublishPack:

```
"Prepare a full multi-platform publish bundle for artifact {artifact_id} 
using canonical source {path} for target platforms {list}. 
Return a manifest with all bundles, file paths, and human next-actions."
```

### Pseudo-Code Prompt Template

```typescript
async function preparePublishBundle(
  artifact: ArtifactDescription
): Promise<PublishManifest> {
  // 1. Read canonical source
  const source = await readCanonicalSource(artifact.canonical_source);
  
  // 2. Generate platform-specific packages
  const packages: PublishManifest['packages'] = {};
  
  if (artifact.target_platforms.includes('arxiv')) {
    packages.arxiv = await ArxivPack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('zora')) {
    packages.zora = await ZoraPack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('github')) {
    packages.github = await GitHubPack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('website')) {
    packages.website = await WebsitePack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('medium')) {
    packages.medium = await MediumPack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('substack')) {
    packages.substack = await SubstackPack.generate(source, artifact);
  }
  
  if (artifact.target_platforms.includes('social')) {
    packages.social = await SocialLaunchPack.generate(source, artifact);
  }
  
  // 3. Generate next actions
  const nextActions = generateNextActions(packages);
  
  // 4. Register in registry
  await registerArtifact(artifact.artifact_id, packages);
  
  // 5. Return manifest
  return {
    artifact_id: artifact.artifact_id,
    status: determineStatus(packages),
    packages,
    next_actions_for_human: nextActions,
  };
}
```

---

## State and Registry

Every run of PublishPack registers an entry in a simple registry:

```typescript
interface ArtifactRegistryEntry {
  artifact_id: string;
  version: string;
  created_at: string;
  platform_status: Record<Platform, "bundled" | `live:${string}` | "error">;
  manifest_path?: string;
}
```

### Example Registry Entry

```json
{
  "artifact_id": "dreamnet_paper_v1",
  "version": "1.0.0",
  "created_at": "2025-12-07T01:23:45Z",
  "platform_status": {
    "arxiv": "bundled",
    "zora": "bundled",
    "github": "bundled",
    "website": "bundled",
    "medium": "bundled"
  }
}
```

After manual publishing, another agent (or CLI) can update it:

```json
{
  "platform_status": {
    "arxiv": "live:https://arxiv.org/abs/2512.12345",
    "zora": "live:https://zora.co/collect/base:0x.../123",
    "github": "live:https://github.com/DreamNetHQ/papers/tree/main/dreamnet_v1",
    "website": "live:https://dreamnet.ink/papers/dreamnet-v1",
    "medium": "live:https://medium.com/@dreamnet/..."
  }
}
```

---

## Security & Guardrails

### Security Principles

- **No Credential Storage**: PublishPack never stores or uses credentials for external sites
- **Local File Operations Only**: It only:
  - Writes local files
  - Prepares bundles
  - Prints instructions
- **Separate Authentication Layer**: A separate, user-authenticated layer handles the final upload

### Guardrails

1. **Input Validation**: Validate artifact description structure
2. **File Path Sanitization**: Ensure all file paths are safe and within build directory
3. **Size Limits**: Enforce platform-specific size limits (e.g., arXiv tarball size)
4. **Format Validation**: Validate LaTeX, PDF, image formats before bundling
5. **Error Handling**: Gracefully handle failures and report errors in manifest

---

## Integration Points

### With Other Agents

- **SocialOpsBot / RelayBot**: Receives social package templates for scheduling
- **Cover Image Generation**: Delegates to Grok/Sora or VisionSmith agent for Zora cover images
- **GitHub Integration**: May integrate with GitHub API (with user credentials) for automated PR creation
- **Website Deployment**: May integrate with Vercel/GitHub Pages deployment (with user credentials)

### With DreamNet Systems

- **Agent Registry**: Register PublishPack as a system agent
- **Nervous System**: Publish events when packages are ready
- **Audit Core**: Log all packaging operations
- **Dream Vault**: Store canonical sources and generated packages

---

## Implementation Order

### Phase 1: Core Implementation

1. **Implement PublishPack as a Cursor / DreamNet agent** that:
   - Reads canonical Markdown
   - Emits:
     - arXiv tarball
     - GitHub files
     - Website HTML page
     - Medium HTML

### Phase 2: Enhanced Platforms

2. **Add ZoraPack** (cover + PDF + metadata)

### Phase 3: Social Distribution

3. **Add SocialLaunchPack** for distribution templates

---

## Usage Examples

### Example 1: Prepare DreamNet Paper for All Platforms

```typescript
import { PublishPackAgent } from '@dreamnet/agents/PublishPack';

const artifact = {
  artifact_id: "dreamnet_paper_v1",
  title: "DreamNet: A Self-Evolving Multi-Agent Ecosystem",
  authors: ["Brandon Ducar", "DreamNet Research Group"],
  abstract: "DreamNet is a self-evolving multi-agent ecosystem...",
  canonical_source: {
    format: "markdown",
    location: "repo://dreamnet/papers/dreamnet_v1.md"
  },
  tags: ["DreamNet", "multi-agent", "Base", "AI ecosystems"],
  primary_category: "cs.AI",
  secondary_categories: ["cs.MA"],
  target_platforms: ["arxiv", "zora", "github", "website", "medium"]
};

const manifest = await PublishPackAgent.preparePublishBundle(artifact);
console.log(manifest.next_actions_for_human);
```

### Example 2: Update Registry After Publishing

```typescript
await PublishPackAgent.updatePlatformStatus("dreamnet_paper_v1", {
  arxiv: "live:https://arxiv.org/abs/2512.12345",
  zora: "live:https://zora.co/collect/base:0x.../123"
});
```

---

## Related Systems

- **Agent Registry Core**: Registers PublishPack as a system agent
- **Dream Vault**: Stores canonical sources and generated packages
- **Social Hub Core**: May integrate for social distribution
- **Media Vault**: Stores cover images and assets
- **GitHub Integration**: For automated repository operations (with credentials)

---

## Future Enhancements

1. **Automated Publishing**: With user credentials, automate final publish step
2. **Version Management**: Track multiple versions of same artifact
3. **Platform Expansion**: Add support for more platforms (ResearchGate, SSRN, etc.)
4. **Template System**: Customizable templates per platform
5. **Preview System**: Generate previews before final bundling
6. **Collaboration**: Multi-author workflow support

---

**Status**: 📋 Documented (Implementation Pending)

