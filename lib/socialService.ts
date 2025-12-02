export type Platform = 'instagram' | 'tiktok' | 'facebook';

export interface SocialAccount {
  id: string;
  platform: Platform;
  accountName: string;
  handle: string;
  profileImageUrl?: string;
  followers: number;
  following: number;
  isConnected: boolean;
  connectedAt?: string;
}

export interface SocialPost {
  id: string;
  accountId: string;
  platform: Platform;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'carousel';
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
}

export interface PlatformStats {
  platform: Platform;
  followers: number;
  engagement30Days: number;
  postCount: number;
  avgEngagementRate: number;
}

export interface SocialData {
  accounts: SocialAccount[];
  posts: SocialPost[];
  platformStats: PlatformStats[];
}

export function getAccountStats(account: SocialAccount): { followers: number; engagement: number } {
  return {
    followers: account.followers,
    engagement: Math.floor(account.followers * 0.045),
  };
}

export function calculateEngagementRate(post: SocialPost): number {
  const totalEngagement = post.likes + post.comments + post.shares + post.saves;
  if (post.views === 0) return 0;
  return Number(((totalEngagement / post.views) * 100).toFixed(2));
}

export function aggregatePosts(posts: SocialPost[]): SocialPost[] {
  return [...posts].sort((a, b) => 
    new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
}

export function filterPostsByPlatform(posts: SocialPost[], platform?: Platform): SocialPost[] {
  if (!platform) return posts;
  return posts.filter(post => post.platform === platform);
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    facebook: 'Facebook',
  };
  return labels[platform];
}

export function getPlatformBadge(platform: Platform): string {
  const badges: Record<Platform, string> = {
    instagram: 'IG',
    tiktok: 'TT',
    facebook: 'FB',
  };
  return badges[platform];
}

export function getPlatformColor(platform: Platform): { bg: string; text: string } {
  const colors: Record<Platform, { bg: string; text: string }> = {
    instagram: { bg: '#fce7f3', text: '#be185d' },
    tiktok: { bg: '#111', text: '#fff' },
    facebook: { bg: '#dbeafe', text: '#1e40af' },
  };
  return colors[platform];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(1, daysAgo));
  date.setHours(randomInt(8, 20), randomInt(0, 59), 0, 0);
  return date.toISOString();
}

export function generateMockAccounts(): SocialAccount[] {
  return [
    {
      id: 'acc-ig-1',
      platform: 'instagram',
      accountName: 'Drizzl Wellness',
      handle: '@drizzlwellness',
      followers: 24500,
      following: 890,
      isConnected: true,
      connectedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'acc-tt-1',
      platform: 'tiktok',
      accountName: 'Drizzl Wellness',
      handle: '@drizzlwellness',
      followers: 45200,
      following: 120,
      isConnected: true,
      connectedAt: '2024-02-01T14:30:00Z',
    },
    {
      id: 'acc-fb-1',
      platform: 'facebook',
      accountName: 'Drizzl Wellness',
      handle: 'DrizzlWellness',
      followers: 12800,
      following: 340,
      isConnected: true,
      connectedAt: '2024-01-20T09:15:00Z',
    },
  ];
}

const instagramCaptions = [
  '✨ Start your morning right with our new Green Goddess smoothie. Packed with spinach, avocado, and a hint of mint. #wellness #smoothie',
  'Your body deserves the best. All-natural ingredients, zero compromise. 🌿 #drizzlwellness #cleaneating',
  'New drop alert! 🚨 Tropical Paradise is here and it\'s everything. Mango, pineapple, coconut magic. #newarrivals',
  'Self-care Sunday calls for a Protein Power bowl. Who\'s joining? 💪 #sundayfunday #protein',
  'Behind the scenes at our kitchen. Every blend is made with love. ❤️ #behindthescenes #smallbusiness',
  'Customer spotlight: "Best smoothies I\'ve ever had!" - @healthyliving_jane 🙌 #customerlove',
];

const tiktokCaptions = [
  'POV: You finally found a smoothie that actually tastes good AND is healthy 🤯 #smoothietok #wellness',
  'Making our viral Green Goddess smoothie from scratch! Watch till the end 🌿✨ #recipe #healthyeating',
  'Replying to @user123: Here\'s how we get that perfect blend every time! #tutorial #smoothie',
  'Day in my life running a wellness brand 🌅 #smallbusiness #entrepreneur #wellness',
  'This smoothie has 30g of protein and tastes like dessert?? 🍫 #proteinshake #gains',
  'POV: Your morning routine after discovering Drizzl 😌 #morningroutine #grwm',
];

const facebookCaptions = [
  'Exciting news! We\'re now available at 50+ Whole Foods locations across California. Find your nearest store on our website! 🎉',
  'Thank you for 10,000 followers! To celebrate, use code FB10K for 15% off your next order. Valid through Sunday!',
  'New blog post: "5 Smoothie Recipes to Boost Your Immunity This Winter" - Link in comments 📚',
  'Meet the team! This week we\'re spotlighting our head nutritionist, Dr. Sarah Chen. Read her story on our blog.',
  'We\'re hiring! Looking for passionate people to join our growing team. Check our careers page for open positions.',
  'Customer recipe alert! @JohnDoe shared his amazing smoothie bowl creation using our Acai Blast. Thanks for sharing!',
];

export function generateMockPosts(): SocialPost[] {
  const posts: SocialPost[] = [];
  const accounts = generateMockAccounts();

  accounts.forEach(account => {
    const captions = account.platform === 'instagram' 
      ? instagramCaptions 
      : account.platform === 'tiktok' 
        ? tiktokCaptions 
        : facebookCaptions;

    captions.forEach((content, index) => {
      const views = account.platform === 'tiktok' 
        ? randomInt(5000, 150000) 
        : account.platform === 'instagram'
          ? randomInt(1000, 25000)
          : randomInt(500, 8000);
      
      const likes = Math.floor(views * (randomInt(3, 12) / 100));
      const comments = Math.floor(views * (randomInt(1, 5) / 100));
      const shares = Math.floor(views * (randomInt(1, 3) / 100));
      const saves = account.platform === 'instagram' ? Math.floor(views * (randomInt(2, 6) / 100)) : 0;

      const post: SocialPost = {
        id: `post-${account.platform}-${index + 1}`,
        accountId: account.id,
        platform: account.platform,
        content,
        mediaType: randomInt(1, 10) > 3 ? 'image' : 'video',
        postedAt: randomDate(30),
        views,
        likes,
        comments,
        shares,
        saves,
        engagementRate: 0,
      };

      post.engagementRate = calculateEngagementRate(post);
      posts.push(post);
    });
  });

  return aggregatePosts(posts);
}

export function generateMockPlatformStats(accounts: SocialAccount[], posts: SocialPost[]): PlatformStats[] {
  const platformGroups: Record<Platform, SocialPost[]> = {
    instagram: [],
    tiktok: [],
    facebook: [],
  };

  posts.forEach(post => {
    platformGroups[post.platform].push(post);
  });

  return accounts.map(account => {
    const platformPosts = platformGroups[account.platform];
    const totalEngagement = platformPosts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares + post.saves,
      0
    );
    const avgEngagementRate = platformPosts.length > 0
      ? platformPosts.reduce((sum, post) => sum + post.engagementRate, 0) / platformPosts.length
      : 0;

    return {
      platform: account.platform,
      followers: account.followers,
      engagement30Days: totalEngagement,
      postCount: platformPosts.length,
      avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
    };
  });
}

export function generateMockSocialData(): SocialData {
  const accounts = generateMockAccounts();
  const posts = generateMockPosts();
  const platformStats = generateMockPlatformStats(accounts, posts);

  return {
    accounts,
    posts,
    platformStats,
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    }
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
