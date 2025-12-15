import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  Search,
  Download,
  Eye,
  Image,
  FileText,
  Video,
  Printer,
  Share2,
  Calendar,
  Package,
  Loader2,
  Filter,
  Sun,
  Sparkles,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

type AssetCategory = 'All Assets' | 'Product Images' | 'Posters & Signage' | 'Social Media' | 'Videos' | 'Print Materials';

interface MarketingAsset {
  id: string;
  name: string;
  category: AssetCategory;
  format: 'PDF' | 'JPG' | 'PNG' | 'MP4' | 'PSD' | 'AI';
  product: string;
  thumbnail: string;
  fileSize: string;
  dimensions?: string;
  duration?: string;
}

interface SeasonalCampaign {
  id: string;
  name: string;
  description: string;
  assetsCount: number;
  thumbnail: string;
  icon: React.ReactNode;
}

const mockAssets: MarketingAsset[] = [
  {
    id: '1',
    name: 'Strawberry Peach Hero Shot',
    category: 'Product Images',
    format: 'JPG',
    product: 'Strawberry Peach',
    thumbnail: '/products/strawberry-peach/gallery-1.jpg',
    fileSize: '4.2 MB',
    dimensions: '3000x3000',
  },
  {
    id: '2',
    name: 'Mango Jackfruit Lifestyle',
    category: 'Product Images',
    format: 'JPG',
    product: 'Mango Jackfruit',
    thumbnail: '/lifestyle/mango-jackfruit/Copy of 890A5348_out1.jpg',
    fileSize: '5.1 MB',
    dimensions: '4000x2667',
  },
  {
    id: '3',
    name: 'Açai Bowl Display Poster',
    category: 'Posters & Signage',
    format: 'PDF',
    product: 'Açai Berry',
    thumbnail: '/products/acai/gallery-1.jpg',
    fileSize: '8.5 MB',
    dimensions: '24x36 inches',
  },
  {
    id: '4',
    name: 'Summer Smoothie Window Decal',
    category: 'Posters & Signage',
    format: 'AI',
    product: 'All Products',
    thumbnail: '/lifestyle/DSC09073-1-2.jpg',
    fileSize: '12.3 MB',
    dimensions: '36x48 inches',
  },
  {
    id: '5',
    name: 'Instagram Story Template - Fresh',
    category: 'Social Media',
    format: 'PSD',
    product: 'Multiple',
    thumbnail: '/lifestyle/DSC08827.jpg',
    fileSize: '15.2 MB',
    dimensions: '1080x1920',
  },
  {
    id: '6',
    name: 'Facebook Post - Wellness Pack',
    category: 'Social Media',
    format: 'PNG',
    product: 'Wellness Collection',
    thumbnail: '/lifestyle/wellness.jpg',
    fileSize: '2.1 MB',
    dimensions: '1200x630',
  },
  {
    id: '7',
    name: 'Product Intro Video - 30s',
    category: 'Videos',
    format: 'MP4',
    product: 'Brand Overview',
    thumbnail: '/lifestyle/DSC09048-1.jpg',
    fileSize: '45 MB',
    duration: '0:30',
  },
  {
    id: '8',
    name: 'Coffee Mushroom Feature',
    category: 'Videos',
    format: 'MP4',
    product: 'Coffee Mushroom',
    thumbnail: '/lifestyle/coffee-lifestyle-1.png',
    fileSize: '78 MB',
    duration: '1:15',
  },
  {
    id: '9',
    name: 'Menu Insert Template',
    category: 'Print Materials',
    format: 'PDF',
    product: 'All Products',
    thumbnail: '/lifestyle/DSC08836.jpg',
    fileSize: '3.4 MB',
    dimensions: '8.5x11 inches',
  },
  {
    id: '10',
    name: 'Table Tent Card',
    category: 'Print Materials',
    format: 'PDF',
    product: 'Featured Products',
    thumbnail: '/lifestyle/DSC09091.jpg',
    fileSize: '2.8 MB',
    dimensions: '4x6 inches',
  },
  {
    id: '11',
    name: 'Almond Smoothie Pack Shot',
    category: 'Product Images',
    format: 'PNG',
    product: 'Almond',
    thumbnail: '/products/almond/gallery-1.jpg',
    fileSize: '6.7 MB',
    dimensions: '3000x3000',
  },
  {
    id: '12',
    name: 'TikTok Vertical Template',
    category: 'Social Media',
    format: 'PSD',
    product: 'Multiple',
    thumbnail: '/lifestyle/DSC08825.jpg',
    fileSize: '18.5 MB',
    dimensions: '1080x1920',
  },
  {
    id: '13',
    name: 'Chocolate Berry Hero',
    category: 'Product Images',
    format: 'JPG',
    product: 'Chocolate Berry',
    thumbnail: '/products/chocolate-berry/gallery-1.jpg',
    fileSize: '4.8 MB',
    dimensions: '3000x3000',
  },
  {
    id: '14',
    name: 'Retail POP Display Guide',
    category: 'Print Materials',
    format: 'PDF',
    product: 'All Products',
    thumbnail: '/lifestyle/DSC09118.jpg',
    fileSize: '5.2 MB',
    dimensions: '11x17 inches',
  },
];

const seasonalCampaigns: SeasonalCampaign[] = [
  {
    id: 'summer-2025',
    name: 'Summer Smoothie Season',
    description: 'Complete marketing kit for summer promotions including posters, social templates, and in-store signage.',
    assetsCount: 24,
    thumbnail: '/lifestyle/beach.jpg',
    icon: <Sun size={24} />,
  },
  {
    id: 'new-year-2025',
    name: 'New Year New You',
    description: 'Health-focused campaign materials perfect for January wellness promotions and resolutions.',
    assetsCount: 18,
    thumbnail: '/lifestyle/wellness.jpg',
    icon: <Sparkles size={24} />,
  },
];

const categories: AssetCategory[] = [
  'All Assets',
  'Product Images',
  'Posters & Signage',
  'Social Media',
  'Videos',
  'Print Materials',
];

function getCategoryIcon(category: AssetCategory) {
  switch (category) {
    case 'Product Images':
      return <Image size={14} />;
    case 'Posters & Signage':
      return <FileText size={14} />;
    case 'Social Media':
      return <Share2 size={14} />;
    case 'Videos':
      return <Video size={14} />;
    case 'Print Materials':
      return <Printer size={14} />;
    default:
      return <Package size={14} />;
  }
}

function getFormatColor(format: string): string {
  switch (format) {
    case 'PDF':
      return '#EF4444';
    case 'JPG':
    case 'PNG':
      return '#3B82F6';
    case 'MP4':
      return '#8B5CF6';
    case 'PSD':
    case 'AI':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
}

export default function MarketingHub() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('All Assets');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewAsset, setPreviewAsset] = useState<MarketingAsset | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartnerName(data.businessName);
    setLoading(false);
  }, [router]);

  const filteredAssets = mockAssets.filter(asset => {
    const matchesCategory = activeCategory === 'All Assets' || asset.category === activeCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (asset: MarketingAsset) => {
    setPreviewAsset(asset);
  };

  const handleDownload = (asset: MarketingAsset) => {
    alert(`Downloading: ${asset.name}.${asset.format.toLowerCase()}`);
  };

  const handleDownloadCampaign = (campaign: SeasonalCampaign) => {
    alert(`Downloading ${campaign.name} campaign (${campaign.assetsCount} assets)`);
  };

  if (loading) {
    return (
      <PartnerLayout title="Marketing Hub" partnerName={partnerName}>
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading marketing resources...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout title="Marketing Hub" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Marketing Resources</h1>
            <p style={styles.subtitle}>Everything you need to promote Drizzl products</p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statBadge}>
              <Image size={16} />
              <span>{mockAssets.length} Assets</span>
            </div>
            <div style={styles.statBadge}>
              <Calendar size={16} />
              <span>{seasonalCampaigns.length} Campaigns</span>
            </div>
          </div>
        </div>

        <div style={styles.filterBar}>
          <div style={styles.categoryTabs}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  ...styles.categoryTab,
                  ...(activeCategory === category ? styles.categoryTabActive : {}),
                }}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </button>
            ))}
          </div>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.assetsSection}>
          <h2 style={styles.sectionTitle}>
            {activeCategory === 'All Assets' ? 'All Marketing Assets' : activeCategory}
            <span style={styles.assetCount}>({filteredAssets.length})</span>
          </h2>

          <div style={styles.assetGrid}>
            {filteredAssets.map(asset => (
              <div key={asset.id} style={styles.assetCard}>
                <div style={styles.thumbnailWrapper}>
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    style={styles.thumbnail}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lifestyle/DSC09048-1.jpg';
                    }}
                  />
                  <div style={styles.thumbnailOverlay}>
                    <button
                      onClick={() => handlePreview(asset)}
                      style={styles.overlayButton}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownload(asset)}
                      style={styles.overlayButton}
                    >
                      <Download size={18} />
                    </button>
                  </div>
                  {asset.duration && (
                    <div style={styles.durationBadge}>{asset.duration}</div>
                  )}
                </div>
                <div style={styles.assetInfo}>
                  <div style={styles.assetHeader}>
                    <span
                      style={{
                        ...styles.formatBadge,
                        backgroundColor: `${getFormatColor(asset.format)}20`,
                        color: getFormatColor(asset.format),
                      }}
                    >
                      {asset.format}
                    </span>
                    <span style={styles.categoryBadge}>
                      {getCategoryIcon(asset.category)}
                      {asset.category.split(' ')[0]}
                    </span>
                  </div>
                  <h3 style={styles.assetName}>{asset.name}</h3>
                  <div style={styles.assetMeta}>
                    <span style={styles.productTag}>
                      <Package size={12} />
                      {asset.product}
                    </span>
                    <span style={styles.fileSize}>{asset.fileSize}</span>
                  </div>
                  <div style={styles.assetActions}>
                    <button
                      onClick={() => handlePreview(asset)}
                      style={styles.previewButton}
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(asset)}
                      style={styles.downloadButton}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div style={styles.emptyState}>
              <Filter size={48} color="#666666" />
              <h3 style={styles.emptyTitle}>No assets found</h3>
              <p style={styles.emptyText}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        <div style={styles.campaignsSection}>
          <h2 style={styles.sectionTitle}>
            <Calendar size={20} />
            Seasonal Campaigns
          </h2>
          <p style={styles.campaignsSubtitle}>
            Ready-to-use marketing kits for seasonal promotions
          </p>

          <div style={styles.campaignGrid}>
            {seasonalCampaigns.map(campaign => (
              <div key={campaign.id} style={styles.campaignCard}>
                <div style={styles.campaignThumbnail}>
                  <img
                    src={campaign.thumbnail}
                    alt={campaign.name}
                    style={styles.campaignImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lifestyle/DSC09048-1.jpg';
                    }}
                  />
                  <div style={styles.campaignOverlay}>
                    <div style={styles.campaignIcon}>{campaign.icon}</div>
                  </div>
                </div>
                <div style={styles.campaignInfo}>
                  <h3 style={styles.campaignName}>{campaign.name}</h3>
                  <p style={styles.campaignDescription}>{campaign.description}</p>
                  <div style={styles.campaignMeta}>
                    <span style={styles.assetCountBadge}>
                      <Package size={14} />
                      {campaign.assetsCount} Assets
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadCampaign(campaign)}
                    style={styles.campaignDownload}
                  >
                    <Download size={16} />
                    Download Entire Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {previewAsset && (
        <div style={styles.modal} onClick={() => setPreviewAsset(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={previewAsset.thumbnail}
              alt={previewAsset.name}
              style={styles.modalImage}
            />
            <div style={styles.modalInfo}>
              <h3 style={styles.modalTitle}>{previewAsset.name}</h3>
              <div style={styles.modalMeta}>
                <span>{previewAsset.format}</span>
                <span>•</span>
                <span>{previewAsset.fileSize}</span>
                {previewAsset.dimensions && (
                  <>
                    <span>•</span>
                    <span>{previewAsset.dimensions}</span>
                  </>
                )}
              </div>
              <button
                onClick={() => handleDownload(previewAsset)}
                style={styles.modalDownload}
              >
                <Download size={18} />
                Download {previewAsset.format}
              </button>
            </div>
            <button
              onClick={() => setPreviewAsset(null)}
              style={styles.modalClose}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
  },
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  headerStats: {
    display: 'flex',
    gap: 12,
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
  },
  filterBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#999999',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: NEON_GREEN,
    color: NEON_GREEN,
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: 400,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  assetsSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  assetCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 400,
    marginLeft: 4,
  },
  assetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  assetCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  thumbnailWrapper: {
    position: 'relative',
    aspectRatio: '16/10',
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 500,
  },
  assetInfo: {
    padding: 16,
  },
  assetHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  formatBadge: {
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  categoryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    fontSize: 11,
    color: '#999999',
  },
  assetName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 10px 0',
    lineHeight: 1.4,
  },
  assetMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#666666',
  },
  fileSize: {
    fontSize: 12,
    color: '#666666',
  },
  assetActions: {
    display: 'flex',
    gap: 8,
  },
  previewButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  downloadButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 6,
    color: '#000000',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
  },
  campaignsSection: {
    marginBottom: 48,
  },
  campaignsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: -12,
    marginBottom: 24,
  },
  campaignGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: 24,
  },
  campaignCard: {
    display: 'flex',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  campaignThumbnail: {
    position: 'relative',
    width: 180,
    minHeight: 200,
    flexShrink: 0,
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  campaignOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  campaignIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 133, 0.2)',
    border: `2px solid ${NEON_GREEN}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  campaignInfo: {
    flex: 1,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  campaignName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  campaignDescription: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 1.5,
    margin: '0 0 16px 0',
    flex: 1,
  },
  campaignMeta: {
    marginBottom: 16,
  },
  assetCountBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 6,
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 500,
  },
  campaignDownload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: 20,
  },
  modalContent: {
    position: 'relative',
    maxWidth: 900,
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    maxHeight: '60vh',
    objectFit: 'contain',
    backgroundColor: '#000000',
  },
  modalInfo: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  modalMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  modalDownload: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 24px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
