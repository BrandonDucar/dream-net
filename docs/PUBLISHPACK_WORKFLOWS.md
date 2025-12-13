# PublishPack - Complete Workflow Documentation

**Status**: 📋 Workflow Documentation  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Workflow Overview

This document contains **standalone, reusable workflows** for PublishPack operations. Each workflow can be executed independently or as part of the complete PublishPack pipeline.

---

## Workflow 1: ArxivPack Generation

### Purpose

Generate arXiv submission package from canonical source.

### Input

```typescript
{
  source: NormalizedSource;
  artifact: ArtifactDescription;
  buildDir: string;
}
```

### Steps

1. **Convert to LaTeX**
   ```typescript
   if (source.format === "markdown") {
     latexContent = await convertMarkdownToLaTeX(source.content, artifact);
   } else if (source.format === "latex") {
     latexContent = source.content;
   }
   ```

2. **Write LaTeX File**
   ```typescript
   await writeFile(`${buildDir}/dreamnet.tex`, latexContent);
   ```

3. **Compile PDF**
   ```typescript
   const pdfResult = await compileLaTeX(texFile, buildDir);
   if (!pdfResult.success) throw new Error("LaTeX compilation failed");
   ```

4. **Collect Files**
   ```typescript
   const files = [
     "dreamnet.tex",
     ...(await findFigures(buildDir)),
     ...(await findBibliography(buildDir))
   ];
   ```

5. **Create Tarball**
   ```typescript
   await createTarball(`${buildDir}/dreamnet.tar.gz`, files, buildDir);
   ```

6. **Generate Metadata**
   ```typescript
   const metadata = {
     primary_category: artifact.primary_category || "cs.AI",
     secondary_categories: artifact.secondary_categories || [],
     title: artifact.title,
     abstract: artifact.abstract,
     authors: artifact.authors
   };
   ```

### Output

```typescript
{
  status: "ready";
  bundle_path: string;
  notes: string;
  checklist: string[];
  metadata: ArxivMetadata;
}
```

### Error Handling

- **LaTeX Compilation Failure**: Return error status, include compilation logs
- **Missing Files**: Warn in notes, continue if non-critical
- **Invalid Format**: Reject early with clear error message

---

## Workflow 2: ZoraPack Generation

### Purpose

Generate Zora NFT mint package with cover image and metadata.

### Input

```typescript
{
  source: NormalizedSource;
  artifact: ArtifactDescription;
  buildDir: string;
}
```

### Steps

1. **Generate Cover Image**
   ```typescript
   const coverPrompt = `Create cover image for: "${artifact.title}". 
     Style: Academic, professional. Related to: ${artifact.tags?.join(", ")}`;
   
   const coverImage = await VisionSmithAgent.run({
     task: "generate",
     data: { prompt: coverPrompt, style: "professional" }
   });
   
   await saveImage(coverImage.output.imageUrl, `${buildDir}/cover_image.png`);
   ```

2. **Prepare PDF**
   ```typescript
   let pdfPath: string;
   if (source.format === "pdf") {
     pdfPath = source.location;
   } else {
     pdfPath = await generatePDF(source, buildDir);
   }
   await copyFile(pdfPath, `${buildDir}/paper.pdf`);
   ```

3. **Generate Metadata**
   ```typescript
   const metadata = {
     name: artifact.title,
     description: `${artifact.abstract}\n\nAuthors: ${artifact.authors.join(", ")}`,
     tags: artifact.tags || ["DreamNet", "AI"],
     edition_size: suggestEditionSize(artifact)
   };
   ```

4. **Package Assets**
   ```typescript
   const assets = [
     `${buildDir}/cover_image.png`,
     `${buildDir}/paper.pdf`
   ];
   ```

### Output

```typescript
{
  status: "ready";
  assets: string[];
  metadata: ZoraMetadata;
  notes: string;
}
```

### Error Handling

- **Image Generation Failure**: Use fallback placeholder image
- **PDF Generation Failure**: Return error, suggest manual PDF upload
- **Metadata Validation**: Validate before packaging

---

## Workflow 3: GitHubPack Generation

### Purpose

Prepare files for GitHub repository commit.

### Input

```typescript
{
  source: NormalizedSource;
  artifact: ArtifactDescription;
  buildDir: string;
  repoConfig: {
    repo: string;
    branch: string;
    usePR: boolean;
  };
}
```

### Steps

1. **Prepare Version Directory**
   ```typescript
   const versionDir = `${buildDir}/${artifact.artifact_id}`;
   await ensureDirectory(versionDir);
   ```

2. **Copy PDF**
   ```typescript
   const pdfDest = `${versionDir}/${artifact.artifact_id}.pdf`;
   await copyFile(source.location, pdfDest);
   ```

3. **Copy LaTeX Source**
   ```typescript
   if (source.format === "latex" || source.format === "markdown") {
     const latexContent = source.format === "latex" 
       ? source.content 
       : await convertMarkdownToLaTeX(source.content, artifact);
     
     await writeFile(`${versionDir}/${artifact.artifact_id}.tex`, latexContent);
   }
   ```

4. **Generate README**
   ```typescript
   const readme = generateREADME(artifact);
   await writeFile(`${versionDir}/README.md`, readme);
   ```

5. **Generate Commit Message**
   ```typescript
   const commitMessage = `Add ${artifact.artifact_id} (PDF + LaTeX + README)`;
   ```

### Output

```typescript
{
  status: "ready";
  repo: string;
  branch: string;
  paths_added: string[];
  commit_message_template: string;
  pr_branch?: string; // If usePR is true
}
```

### Error Handling

- **File Copy Failure**: Retry with exponential backoff
- **README Generation Failure**: Use template fallback
- **Repository Access**: Return error if repo not accessible

---

## Workflow 4: WebsitePack Generation

### Purpose

Generate static HTML page for website deployment.

### Input

```typescript
{
  source: NormalizedSource;
  artifact: ArtifactDescription;
  buildDir: string;
  siteConfig?: {
    baseUrl: string;
    styles?: string;
  };
}
```

### Steps

1. **Generate HTML**
   ```typescript
   const html = generateHTMLPage(artifact, source, siteConfig);
   await writeFile(`${buildDir}/index.html`, html);
   ```

2. **Copy Assets**
   ```typescript
   if (source.hasCoverImage) {
     await copyFile(source.coverImagePath, `${buildDir}/cover.png`);
   }
   ```

3. **Generate Route**
   ```typescript
   const route = `/papers/${artifact.artifact_id.replace(/_/g, "-")}`;
   ```

### Output

```typescript
{
  status: "ready";
  route: string;
  files: string[];
}
```

### Error Handling

- **HTML Generation Failure**: Return error with template fallback
- **Asset Copy Failure**: Continue without assets, warn in notes

---

## Workflow 5: MediumPack Generation

### Purpose

Convert content to Medium-compatible HTML.

### Input

```typescript
{
  source: NormalizedSource;
  artifact: ArtifactDescription;
  buildDir: string;
}
```

### Steps

1. **Convert to HTML**
   ```typescript
   let htmlContent: string;
   if (source.format === "markdown") {
     htmlContent = await convertMarkdownToHTML(source.content);
   } else if (source.format === "latex") {
     htmlContent = await convertLaTeXToHTML(source.content);
   }
   ```

2. **Inject Medium Elements**
   ```typescript
   const mediumHTML = injectMediumElements(htmlContent, artifact);
   ```

3. **Save HTML File**
   ```typescript
   await writeFile(`${buildDir}/${artifact.artifact_id}_medium.html`, mediumHTML);
   ```

### Output

```typescript
{
  status: "ready";
  filename: string;
  notes: string;
}
```

### Error Handling

- **Conversion Failure**: Return error with partial HTML
- **HTML Validation**: Warn if HTML doesn't validate

---

## Workflow 6: SocialLaunchPack Generation

### Purpose

Generate social media content templates.

### Input

```typescript
{
  artifact: ArtifactDescription;
  urls?: Record<Platform, string>; // Optional: real URLs if available
}
```

### Steps

1. **Generate Captions**
   ```typescript
   const captions = {
     twitter: generateTwitterCaption(artifact, urls),
     farcaster: generateFarcasterCaption(artifact, urls),
     lens: generateLensCaption(artifact, urls),
     tiktok: generateTikTokCaption(artifact, urls)
   };
   ```

2. **Generate Threads**
   ```typescript
   const threads = {
     twitter: generateTwitterThread(artifact, urls),
     farcaster: generateFarcasterThread(artifact, urls)
   };
   ```

3. **Extract Quote Hooks**
   ```typescript
   const quoteHooks = extractQuoteHooks(artifact.abstract);
   ```

4. **Generate Hashtags**
   ```typescript
   const hashtags = generateHashtags(artifact);
   ```

### Output

```typescript
{
  status: "ready";
  caption_templates: Array<{
    platform: string;
    caption: string;
    hashtags: string[];
  }>;
  thread_templates: Array<{
    platform: string;
    threads: string[];
  }>;
  quote_hooks: string[];
}
```

### Error Handling

- **Template Generation Failure**: Use fallback templates
- **URL Injection Failure**: Keep placeholders, warn in notes

---

## Workflow 7: Manifest Generation

### Purpose

Aggregate all platform packages into a single manifest.

### Input

```typescript
{
  artifact: ArtifactDescription;
  packages: PlatformPackages;
}
```

### Steps

1. **Verify Packages**
   ```typescript
   const allReady = Object.values(packages).every(pkg => pkg.status === "ready");
   const hasErrors = Object.values(packages).some(pkg => pkg.status === "error");
   ```

2. **Generate Next Actions**
   ```typescript
   const nextActions = generateNextActions(packages);
   ```

3. **Create Manifest**
   ```typescript
   const manifest: PublishManifest = {
     artifact_id: artifact.artifact_id,
     status: allReady ? "ready_for_manual_publish" : hasErrors ? "partially_ready" : "ready_for_manual_publish",
     packages,
     next_actions_for_human: nextActions
   };
   ```

4. **Save Manifest**
   ```typescript
   await writeFile(`build/${artifact.artifact_id}/manifest.json`, JSON.stringify(manifest, null, 2));
   ```

### Output

```typescript
PublishManifest
```

### Error Handling

- **Package Validation Failure**: Include errors in manifest
- **Manifest Generation Failure**: Return error with partial manifest

---

## Workflow 8: Registry Management

### Purpose

Manage artifact registry entries and status updates.

### Sub-Workflow 8.1: Create Registry Entry

**Steps**:
1. Generate registry entry
2. Set initial platform statuses to "bundled"
3. Save to registry store
4. Return entry

**Input**:
```typescript
{
  artifact_id: string;
  version: string;
  platforms: Platform[];
}
```

**Output**:
```typescript
ArtifactRegistryEntry
```

### Sub-Workflow 8.2: Update Platform Status

**Steps**:
1. Load registry entry
2. Update platform status to "live:{url}"
3. Save updated entry
4. Update manifest with URL
5. Check if all platforms live
6. Trigger downstream actions if all live

**Input**:
```typescript
{
  artifact_id: string;
  platform: Platform;
  url: string;
}
```

**Output**:
```typescript
{
  success: boolean;
  all_platforms_live: boolean;
}
```

---

## Workflow 9: Error Recovery

### Purpose

Handle errors and attempt recovery.

### Error Types

1. **Source Loading Error**
   - Retry with exponential backoff
   - Try alternative source locations
   - Fallback to cached source

2. **Conversion Error**
   - Try alternative conversion method
   - Use simplified format
   - Return partial output with warnings

3. **Platform Generation Error**
   - Skip platform, continue with others
   - Mark platform as "error" in manifest
   - Provide error details in notes

4. **Validation Error**
   - Return early with clear error message
   - Suggest fixes
   - Log for debugging

### Recovery Workflow

```
Error Detected
  ↓
1. Classify Error
  ↓
2. Check Recovery Strategy
  ├─→ Retry (for transient errors)
  ├─→ Fallback (for conversion errors)
  └─→ Skip (for platform errors)
  ↓
3. Attempt Recovery
  ↓
4. Update Status
  ├─→ Success: Continue
  └─→ Failure: Mark error, continue if non-critical
```

---

## Workflow 10: Integration with Downstream Agents

### Purpose

Trigger downstream agents after publishing.

### SocialOpsBot Integration

**Trigger**: When URLs are live

**Workflow**:
1. Load social package from manifest
2. Inject real URLs into templates
3. Schedule posts with SocialOpsBot
4. Confirm scheduling

### RelayBot Integration

**Trigger**: When manifest is ready

**Workflow**:
1. Extract key information from manifest
2. Format for RelayBot
3. Send to RelayBot for distribution
4. Track distribution status

---

## Workflow Execution Patterns

### Sequential Execution

Execute platform packs one at a time:

```typescript
for (const platform of artifact.target_platforms) {
  const pack = await generatePlatformPack(platform, source, artifact);
  packages[platform] = pack;
}
```

### Parallel Execution

Execute platform packs in parallel:

```typescript
const packPromises = artifact.target_platforms.map(platform =>
  generatePlatformPack(platform, source, artifact)
);

const packResults = await Promise.allSettled(packPromises);

for (let i = 0; i < artifact.target_platforms.length; i++) {
  const platform = artifact.target_platforms[i];
  const result = packResults[i];
  
  if (result.status === "fulfilled") {
    packages[platform] = result.value;
  } else {
    packages[platform] = {
      status: "error",
      error: result.reason.message
    };
  }
}
```

### Conditional Execution

Execute packs based on dependencies:

```typescript
// ArxivPack must complete before WebsitePack (for PDF)
const arxivPack = await generateArxivPack(source, artifact);
if (arxivPack.status === "ready") {
  source.pdfPath = arxivPack.pdf_path;
  const websitePack = await generateWebsitePack(source, artifact);
}
```

---

## Workflow Testing

### Unit Testing

Test each workflow independently:

```typescript
describe("ArxivPack Workflow", () => {
  it("should generate tarball from LaTeX source", async () => {
    const source = createMockSource("latex");
    const artifact = createMockArtifact();
    const result = await generateArxivPack(source, artifact);
    expect(result.status).toBe("ready");
    expect(result.bundle_path).toMatch(/\.tar\.gz$/);
  });
});
```

### Integration Testing

Test workflows together:

```typescript
describe("PublishPack Integration", () => {
  it("should generate all platform packs", async () => {
    const manifest = await PublishPackAgent.preparePublishBundle(mockArtifact);
    expect(manifest.packages.arxiv).toBeDefined();
    expect(manifest.packages.zora).toBeDefined();
    expect(manifest.packages.github).toBeDefined();
  });
});
```

---

**Status**: 📋 Complete Workflow Documentation

