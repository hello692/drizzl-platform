import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateMockVideos,
  reorderVideos,
  validateVideoUrl,
  generateThumbnail,
  Video,
} from '../../../../lib/videoManagerService';

interface VideoResponse {
  success: boolean;
  data?: Video[];
  video?: Video;
  error?: string;
  message?: string;
}

let mockVideos: Video[] | null = null;

function initializeMockData() {
  if (!mockVideos) {
    mockVideos = generateMockVideos();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoResponse>
) {
  initializeMockData();

  if (req.method === 'GET') {
    const sortedVideos = [...mockVideos!].sort((a, b) => a.position - b.position);
    return res.status(200).json({
      success: true,
      data: sortedVideos,
    });
  }

  if (req.method === 'POST') {
    const { url, caption, autoplay, loop, platform } = req.body;

    if (!url || !caption) {
      return res.status(400).json({
        success: false,
        error: 'URL and caption are required',
      });
    }

    const validation = validateVideoUrl(url);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const maxPosition = Math.max(...mockVideos!.map(v => v.position), 0);
    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      url,
      caption,
      position: maxPosition + 1,
      autoplay: autoplay ?? false,
      loop: loop ?? false,
      platform: platform ?? 'both',
      isActive: true,
      thumbnailUrl: generateThumbnail(url),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockVideos!.push(newVideo);

    return res.status(201).json({
      success: true,
      video: newVideo,
      message: 'Video added successfully',
    });
  }

  if (req.method === 'PUT') {
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({
        success: false,
        error: 'Order array is required',
      });
    }

    mockVideos = reorderVideos(mockVideos!, order);

    return res.status(200).json({
      success: true,
      data: mockVideos,
      message: 'Video order updated successfully',
    });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
