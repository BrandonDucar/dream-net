#!/usr/bin/env tsx
/**
 * Check GitHub Repositories
 * 
 * Lists your GitHub repositories to find Replit-connected projects
 * Requires: GITHUB_TOKEN environment variable
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

if (!GITHUB_TOKEN) {
  console.log('❌ GITHUB_TOKEN not found in environment variables');
  console.log('');
  console.log('To get a GitHub token:');
  console.log('1. Go to https://github.com/settings/tokens');
  console.log('2. Click "Generate new token (classic)"');
  console.log('3. Give it "repo" scope');
  console.log('4. Copy the token');
  console.log('5. Set it: export GITHUB_TOKEN=your_token_here');
  console.log('');
  process.exit(1);
}

async function listRepos() {
  try {
    const username = GITHUB_USERNAME || await getUsername();
    
    console.log(`🔍 Checking GitHub repositories for: ${username}\n`);
    
    // Get all repos
    const repos: any[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      repos.push(...data);
      
      hasMore = data.length === 100;
      page++;
    }
    
    console.log(`📦 Found ${repos.length} repositories\n`);
    
    // Filter for Replit-related repos
    const replitRepos = repos.filter(repo => 
      repo.name.toLowerCase().includes('replit') ||
      repo.name.toLowerCase().includes('aethersafe') ||
      repo.description?.toLowerCase().includes('replit') ||
      repo.topics?.some((t: string) => t.includes('replit'))
    );
    
    // Show all repos with Replit-related ones highlighted
    console.log('📋 All Repositories:\n');
    repos.forEach(repo => {
      const isReplit = replitRepos.includes(repo);
      const marker = isReplit ? '🔥' : '  ';
      const status = repo.archived ? '(archived)' : '';
      console.log(`${marker} ${repo.name} ${status}`);
      console.log(`   ${repo.html_url}`);
      if (repo.description) {
        console.log(`   ${repo.description}`);
      }
      console.log('');
    });
    
    if (replitRepos.length > 0) {
      console.log('\n🔥 Replit-Related Repositories:\n');
      replitRepos.forEach(repo => {
        console.log(`✅ ${repo.name}`);
        console.log(`   URL: ${repo.html_url}`);
        console.log(`   Clone: git clone ${repo.clone_url}`);
        console.log('');
      });
      
      console.log('\n💡 To migrate a repo:');
      console.log('   1. Clone it: git clone <clone_url>');
      console.log('   2. Move to packages/: mv <repo-name> packages/');
      console.log('   3. Run: bash scripts/migrate-from-replit.sh');
    } else {
      console.log('\n💡 No obvious Replit repos found, but you can still migrate manually');
      console.log('   Check repos that might be from Replit (like aethersafe)');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function getUsername(): Promise<string> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get GitHub username');
  }
  
  const user = await response.json();
  return user.login;
}

listRepos().catch(console.error);

