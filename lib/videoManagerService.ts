export interface Video {
  id: string;
  url: string;
  caption: string;
  position: number;
  autoplay: boolean;
  loop: boolean;
  platform: 'desktop' | 'mobile' | 'both';
  isActive: boolean;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function generateMockVideos(): Video[] {
  return [
    {
      id: 'vid-001',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      caption: 'Hero Landing Video',
      position: 1,
      autoplay: true,
      loop: true,
      platform: 'both',
      isActive: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'vid-002',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      caption: 'Product Showcase',
      position: 2,
      autoplay: false,
      loop: true,
      platform: 'desktop',
      isActive: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop',
      createdAt: '2024-01-14T09:30:00Z',
      updatedAt: '2024-01-14T09:30:00Z',
    },
    {
      id: 'vid-003',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: 'Mobile Welcome',
      position: 3,
      autoplay: true,
      loop: false,
      platform: 'mobile',
      isActive: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      createdAt: '2024-01-13T14:15:00Z',
      updatedAt: '2024-01-13T14:15:00Z',
    },
    {
      id: 'vid-004',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      caption: 'Brand Story',
      position: 4,
      autoplay: false,
      loop: false,
      platform: 'both',
      isActive: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop',
      createdAt: '2024-01-12T11:00:00Z',
      updatedAt: '2024-01-12T11:00:00Z',
    },
    {
      id: 'vid-005',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      caption: 'Wellness Journey',
      position: 5,
      autoplay: true,
      loop: true,
      platform: 'desktop',
      isActive: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=225&fit=crop',
      createdAt: '2024-01-11T16:45:00Z',
      updatedAt: '2024-01-11T16:45:00Z',
    },
  ];
}

export function reorderVideos(videos: Video[], newOrder: string[]): Video[] {
  const videoMap = new Map(videos.map(v => [v.id, v]));
  return newOrder.map((id, index) => {
    const video = videoMap.get(id);
    if (video) {
      return { ...video, position: index + 1, updatedAt: new Date().toISOString() };
    }
    return null;
  }).filter((v): v is Video => v !== null);
}

export function validateVideoUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const parsedUrl = new URL(url);
    const validProtocols = ['http:', 'https:'];
    if (!validProtocols.includes(parsedUrl.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const isVideoFile = videoExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
    
    const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'wistia.com', 'storage.googleapis.com'];
    const isVideoHost = videoHosts.some(host => parsedUrl.hostname.includes(host));

    if (!isVideoFile && !isVideoHost) {
      return { valid: true, error: 'Warning: URL may not be a valid video source' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function generateThumbnail(videoUrl: string): string {
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = extractYoutubeId(videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  if (videoUrl.includes('vimeo.com')) {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function moveVideoUp(videos: Video[], videoId: string): Video[] {
  const index = videos.findIndex(v => v.id === videoId);
  if (index <= 0) return videos;

  const newVideos = [...videos];
  [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
  
  return newVideos.map((v, i) => ({ ...v, position: i + 1 }));
}

export function moveVideoDown(videos: Video[], videoId: string): Video[] {
  const index = videos.findIndex(v => v.id === videoId);
  if (index === -1 || index >= videos.length - 1) return videos;

  const newVideos = [...videos];
  [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
  
  return newVideos.map((v, i) => ({ ...v, position: i + 1 }));
}
