import { getUncachableGitHubClient } from '../lib/githubClient';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function pushToGitHub() {
  try {
    console.log('Getting GitHub client...');
    const octokit = await getUncachableGitHubClient();
    
    console.log('Getting authenticated user...');
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    const repoName = 'drizzl-platform';
    
    let repoExists = false;
    try {
      await octokit.repos.get({
        owner: user.login,
        repo: repoName
      });
      repoExists = true;
      console.log(`Repository ${repoName} already exists`);
    } catch (e: any) {
      if (e.status === 404) {
        console.log(`Creating repository ${repoName}...`);
        await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'Drizzl Wellness - D2C + B2B E-Commerce Platform',
          private: false,
          auto_init: false
        });
        console.log(`Repository ${repoName} created!`);
      } else {
        throw e;
      }
    }
    
    console.log('Configuring git...');
    const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser();
    const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email || 'noreply@github.com';
    
    execSync(`git config user.email "${primaryEmail}"`, { stdio: 'inherit' });
    execSync(`git config user.name "${user.login}"`, { stdio: 'inherit' });
    
    const { data: tokenData } = await octokit.users.getAuthenticated();
    const token = await getAccessTokenForPush();
    
    const remoteUrl = `https://${user.login}:${token}@github.com/${user.login}/${repoName}.git`;
    
    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch (e) {
    }
    
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    
    console.log('Adding all files...');
    execSync('git add -A', { stdio: 'inherit' });
    
    try {
      execSync('git commit -m "Initial commit: Drizzl Wellness Platform"', { stdio: 'inherit' });
    } catch (e) {
      console.log('No new changes to commit or already committed');
    }
    
    console.log('Pushing to GitHub...');
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    
    console.log(`\nSuccess! Repository pushed to: https://github.com/${user.login}/${repoName}`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function getAccessTokenForPush(): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error('Replit environment not configured');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  const connectionSettings = data.items?.[0];
  
  return connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;
}

pushToGitHub();
