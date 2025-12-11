import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateMockPosts,
  filterPostsByPlatform,
  SocialPost,
  Platform,
} from '../../../../lib/socialService';

interface PostsResponse {
  success: boolean;
  data?: SocialPost[];
  total?: number;
  error?: string;
}

let cachedPosts: SocialPost[] | null = null;

function initializeMockPosts(): SocialPost[] {
  if (!cachedPosts) {
    cachedPosts = generateMockPosts();
  }
  return cachedPosts;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsResponse>
) {
  if (req.method === 'GET') {
    try {
      const { platform, limit, offset } = req.query;
      
      let posts = initializeMockPosts();
      
      if (platform && ['instagram', 'tiktok', 'facebook'].includes(platform as string)) {
        posts = filterPostsByPlatform(posts, platform as Platform);
      }
      
      const total = posts.length;
      
      const limitNum = limit ? parseInt(limit as string, 10) : 50;
      const offsetNum = offset ? parseInt(offset as string, 10) : 0;
      
      const paginatedPosts = posts.slice(offsetNum, offsetNum + limitNum);
      
      return res.status(200).json({
        success: true,
        data: paginatedPosts,
        total,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch posts',
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
