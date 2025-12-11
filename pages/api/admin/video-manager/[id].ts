import type { NextApiRequest, NextApiResponse } from 'next';
import { generateMockVideos, Video } from '../../../../lib/videoManagerService';

interface VideoResponse {
  success: boolean;
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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing video ID',
    });
  }

  if (req.method === 'GET') {
    const video = mockVideos!.find(v => v.id === id);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    return res.status(200).json({
      success: true,
      video,
    });
  }

  if (req.method === 'PUT') {
    const videoIndex = mockVideos!.findIndex(v => v.id === id);

    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    const { url, caption, autoplay, loop, platform, isActive } = req.body;

    const updatedVideo: Video = {
      ...mockVideos![videoIndex],
      ...(url !== undefined && { url }),
      ...(caption !== undefined && { caption }),
      ...(autoplay !== undefined && { autoplay }),
      ...(loop !== undefined && { loop }),
      ...(platform !== undefined && { platform }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    mockVideos![videoIndex] = updatedVideo;

    return res.status(200).json({
      success: true,
      video: updatedVideo,
      message: 'Video updated successfully',
    });
  }

  if (req.method === 'DELETE') {
    const videoIndex = mockVideos!.findIndex(v => v.id === id);

    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    mockVideos!.splice(videoIndex, 1);

    mockVideos = mockVideos!.map((v, i) => ({
      ...v,
      position: i + 1,
    }));

    return res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
