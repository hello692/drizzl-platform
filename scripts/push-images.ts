import { getUncachableGitHubClient } from '../lib/githubClient';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = 'drizzl-platform';

async function getAllBinaryFiles(dirPath: string, basePath: string = ''): Promise<{path: string, content: Buffer}[]> {
  const files: {path: string, content: Buffer}[] = [];
  
  if (!fs.existsSync(dirPath)) return files;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    
    if (fs.statSync(fullPath).isDirectory()) {
      const subFiles = await getAllBinaryFiles(fullPath, relativePath);
      files.push(...subFiles);
    } else {
      try {
        const content = fs.readFileSync(fullPath);
        files.push({ path: relativePath, content });
      } catch (e) {
        console.log(`  Skipped: ${relativePath}`);
      }
    }
  }
  
  return files;
}

async function pushImages() {
  try {
    console.log('Connecting to GitHub...');
    const octokit = await getUncachableGitHubClient();
    
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Collect all files from public folder
    console.log('Collecting files from public folder...');
    const publicPath = path.join(process.cwd(), 'public');
    const allFiles = await getAllBinaryFiles(publicPath, 'public');
    
    console.log(`Found ${allFiles.length} files to upload`);
    
    // Get current commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
    });
    const latestCommitSha = ref.object.sha;
    
    // Get current tree
    const { data: currentCommit } = await octokit.git.getCommit({
      owner: user.login,
      repo: REPO_NAME,
      commit_sha: latestCommitSha,
    });
    
    console.log('Creating blobs for files...');
    
    // Create blobs for each file
    const treeItems: any[] = [];
    let count = 0;
    
    for (const file of allFiles) {
      count++;
      if (count % 20 === 0) {
        console.log(`  Progress: ${count}/${allFiles.length}`);
      }
      
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: REPO_NAME,
        content: file.content.toString('base64'),
        encoding: 'base64',
      });
      
      treeItems.push({
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      });
    }
    
    console.log('Creating tree...');
    
    // Create new tree
    const { data: tree } = await octokit.git.createTree({
      owner: user.login,
      repo: REPO_NAME,
      tree: treeItems,
      base_tree: currentCommit.tree.sha,
    });
    
    console.log('Creating commit...');
    
    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner: user.login,
      repo: REPO_NAME,
      message: 'Add public folder with images and videos',
      tree: tree.sha,
      parents: [latestCommitSha],
    });
    
    console.log('Updating main branch...');
    
    // Update main branch
    await octokit.git.updateRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: commit.sha,
    });
    
    console.log(`\n✅ Success! Images pushed to GitHub`);
    console.log('\nNow go to Netlify and trigger a new deploy to see your images!');
    
  } catch (error: any) {
    console.error('\nError:', error.message || error);
    if (error.response) {
      console.error('GitHub API response:', error.response.data);
    }
    process.exit(1);
  }
}

pushImages();
