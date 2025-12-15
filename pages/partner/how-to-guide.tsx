import React, { useState } from 'react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  Play,
  Clock,
  Eye,
  Star,
  Download,
  FileText,
  CheckSquare,
  Calendar,
  Users,
  X,
  BookOpen,
  Package,
  Layout,
  TrendingUp,
  Megaphone,
  Truck,
  HeadphonesIcon,
  AlertTriangle,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const categories = [
  { id: 'all', label: 'All Videos', icon: Play },
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'product-knowledge', label: 'Product Knowledge', icon: Package },
  { id: 'merchandising', label: 'Merchandising & Display', icon: Layout },
  { id: 'sales', label: 'Sales Techniques', icon: TrendingUp },
  { id: 'marketing', label: 'Marketing & Promotion', icon: Megaphone },
  { id: 'operations', label: 'Operations & Logistics', icon: Truck },
  { id: 'customer-service', label: 'Customer Service', icon: HeadphonesIcon },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
];

const videos = [
  { id: 1, title: 'Welcome to Drizzl Partnership', duration: '5:00', category: 'getting-started', views: 2450, rating: 4.9, watched: true, thumbnail: '/carousel/carousel-1.webp' },
  { id: 2, title: 'Setting Up Your Account', duration: '3:00', category: 'getting-started', views: 2180, rating: 4.8, watched: true, thumbnail: '/carousel/carousel-2.webp' },
  { id: 3, title: 'Your First Order - Step by Step', duration: '8:00', category: 'getting-started', views: 1950, rating: 4.9, watched: true, thumbnail: '/carousel/carousel-3.webp' },
  { id: 4, title: 'Complete Product Overview', duration: '15:00', category: 'product-knowledge', views: 1820, rating: 4.7, watched: true, thumbnail: '/carousel/carousel-4.webp' },
  { id: 5, title: 'Optimal Freezer Layout', duration: '7:00', category: 'merchandising', views: 1650, rating: 4.8, watched: true, thumbnail: '/carousel/carousel-5.webp' },
  { id: 6, title: 'Selling Health Benefits', duration: '8:00', category: 'sales', views: 1520, rating: 4.6, watched: false, thumbnail: '/carousel/carousel-6.webp' },
  { id: 7, title: 'Smoothie Flavor Profiles Deep Dive', duration: '12:00', category: 'product-knowledge', views: 1480, rating: 4.8, watched: false, thumbnail: '/carousel/carousel-7.webp' },
  { id: 8, title: 'Creating Eye-Catching Displays', duration: '10:00', category: 'merchandising', views: 1350, rating: 4.7, watched: false, thumbnail: '/carousel/carousel-8.webp' },
  { id: 9, title: 'Upselling Strategies That Work', duration: '9:00', category: 'sales', views: 1280, rating: 4.5, watched: false, thumbnail: '/carousel/carousel-9.webp' },
  { id: 10, title: 'Social Media Marketing 101', duration: '11:00', category: 'marketing', views: 1150, rating: 4.6, watched: false, thumbnail: '/carousel/carousel-10.webp' },
  { id: 11, title: 'Inventory Management Best Practices', duration: '14:00', category: 'operations', views: 980, rating: 4.7, watched: false, thumbnail: '/carousel/carousel-11.webp' },
  { id: 12, title: 'Handling Customer Questions', duration: '6:00', category: 'customer-service', views: 920, rating: 4.8, watched: false, thumbnail: '/carousel/carousel-12.webp' },
  { id: 13, title: 'Common Issues & Solutions', duration: '8:00', category: 'troubleshooting', views: 850, rating: 4.6, watched: false, thumbnail: '/carousel/carousel-13.webp' },
  { id: 14, title: 'Local Marketing Strategies', duration: '10:00', category: 'marketing', views: 780, rating: 4.5, watched: false, thumbnail: '/carousel/carousel-14.webp' },
  { id: 15, title: 'Temperature & Storage Guidelines', duration: '5:00', category: 'operations', views: 720, rating: 4.9, watched: false, thumbnail: '/carousel/carousel-15.webp' },
  { id: 16, title: 'Building Customer Loyalty', duration: '7:00', category: 'customer-service', views: 680, rating: 4.7, watched: false, thumbnail: '/carousel/carousel-1.webp' },
  { id: 17, title: 'Seasonal Promotion Ideas', duration: '9:00', category: 'marketing', views: 620, rating: 4.6, watched: false, thumbnail: '/carousel/carousel-2.webp' },
  { id: 18, title: 'Delivery & Receiving Process', duration: '6:00', category: 'operations', views: 580, rating: 4.8, watched: false, thumbnail: '/carousel/carousel-3.webp' },
];

const resources = [
  { id: 1, title: 'Partner Onboarding Checklist', type: 'PDF', size: '2.4 MB', icon: CheckSquare },
  { id: 2, title: 'Product Fact Sheets', type: 'PDF', size: '5.1 MB', icon: FileText },
  { id: 3, title: 'Merchandising Guidelines', type: 'PDF', size: '3.8 MB', icon: Layout },
  { id: 4, title: 'Sales Scripts & Tips', type: 'PDF', size: '1.9 MB', icon: TrendingUp },
  { id: 5, title: 'Marketing Asset Pack', type: 'ZIP', size: '45 MB', icon: Megaphone },
  { id: 6, title: 'Inventory Tracking Template', type: 'XLSX', size: '0.5 MB', icon: Package },
];

const webinars = [
  { id: 1, title: 'Q1 2026 Product Launch Preview', date: 'Jan 15, 2026', time: '2:00 PM EST', host: 'Sarah Johnson', spots: 45 },
  { id: 2, title: 'Advanced Selling Techniques Workshop', date: 'Jan 22, 2026', time: '11:00 AM EST', host: 'Michael Chen', spots: 32 },
  { id: 3, title: 'Summer Merchandising Strategies', date: 'Jan 29, 2026', time: '3:00 PM EST', host: 'Emily Rodriguez', spots: 58 },
];

export default function HowToGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videoModal, setVideoModal] = useState<typeof videos[0] | null>(null);

  const watchedCount = videos.filter(v => v.watched).length;
  const totalCount = videos.length;
  const progressPercent = (watchedCount / totalCount) * 100;

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const getCategoryLabel = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.label || categoryId;
  };

  return (
    <PartnerLayout title="How-To Guide" partnerName="Partner">
      <div style={styles.page}>
        <div style={styles.progressBanner}>
          <div style={styles.progressContent}>
            <div style={styles.progressInfo}>
              <Play size={20} color={NEON_GREEN} />
              <span style={styles.progressText}>
                You've watched <strong style={{ color: NEON_GREEN }}>{watchedCount}</strong> of <strong>{totalCount}</strong> videos
              </span>
            </div>
            <div style={styles.progressBarContainer}>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
              </div>
              <span style={styles.progressPercent}>{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <aside style={styles.sidebar} className="how-to-sidebar">
            <h3 style={styles.sidebarTitle}>Categories</h3>
            <nav style={styles.categoryList}>
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                const count = category.id === 'all' 
                  ? videos.length 
                  : videos.filter(v => v.category === category.id).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      ...styles.categoryButton,
                      ...(isActive ? styles.categoryButtonActive : {}),
                    }}
                  >
                    <Icon size={18} />
                    <span style={styles.categoryLabel}>{category.label}</span>
                    <span style={styles.categoryCount}>{count}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Video Library</h2>
              <span style={styles.videoCount}>{filteredVideos.length} videos</span>
            </div>

            <div style={styles.videoGrid} className="video-grid">
              {filteredVideos.map((video) => (
                <div key={video.id} style={styles.videoCard} className="video-card">
                  <div style={styles.thumbnailContainer}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={styles.thumbnail}
                    />
                    <div style={styles.playOverlay} className="play-overlay">
                      <div style={styles.playButton}>
                        <Play size={24} fill="#000" color="#000" />
                      </div>
                    </div>
                    <div style={styles.durationBadge}>
                      <Clock size={12} />
                      {video.duration}
                    </div>
                    {video.watched && (
                      <div style={styles.watchedBadge}>✓ Watched</div>
                    )}
                  </div>
                  <div style={styles.videoInfo}>
                    <span style={styles.categoryBadge}>{getCategoryLabel(video.category)}</span>
                    <h3 style={styles.videoTitle}>{video.title}</h3>
                    <div style={styles.videoMeta}>
                      <span style={styles.metaItem}>
                        <Eye size={14} />
                        {video.views.toLocaleString()}
                      </span>
                      <span style={styles.metaItem}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        {video.rating}
                      </span>
                    </div>
                    <button 
                      onClick={() => setVideoModal(video)}
                      style={styles.watchButton}
                      className="watch-btn"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.resourcesSection}>
              <h2 style={styles.sectionTitle}>Downloadable Resources</h2>
              <p style={styles.sectionSubtitle}>PDF guides, checklists, and templates to support your success</p>
              <div style={styles.resourceGrid}>
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <div key={resource.id} style={styles.resourceCard}>
                      <div style={styles.resourceIcon}>
                        <Icon size={24} color={NEON_GREEN} />
                      </div>
                      <div style={styles.resourceInfo}>
                        <h4 style={styles.resourceTitle}>{resource.title}</h4>
                        <span style={styles.resourceMeta}>{resource.type} • {resource.size}</span>
                      </div>
                      <button style={styles.downloadButton} className="download-btn">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.webinarsSection}>
              <h2 style={styles.sectionTitle}>Live Webinars</h2>
              <p style={styles.sectionSubtitle}>Join our expert-led sessions to level up your partnership</p>
              <div style={styles.webinarGrid}>
                {webinars.map((webinar) => (
                  <div key={webinar.id} style={styles.webinarCard}>
                    <div style={styles.webinarHeader}>
                      <div style={styles.webinarDate}>
                        <Calendar size={16} color={NEON_GREEN} />
                        <span>{webinar.date}</span>
                      </div>
                      <span style={styles.webinarTime}>{webinar.time}</span>
                    </div>
                    <h3 style={styles.webinarTitle}>{webinar.title}</h3>
                    <div style={styles.webinarMeta}>
                      <span style={styles.webinarHost}>Hosted by {webinar.host}</span>
                      <span style={styles.webinarSpots}>
                        <Users size={14} />
                        {webinar.spots} spots left
                      </span>
                    </div>
                    <button style={styles.registerButton} className="register-btn">
                      Register for Webinar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        {videoModal && (
          <div style={styles.modalOverlay} onClick={() => setVideoModal(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setVideoModal(null)}
                style={styles.modalClose}
              >
                <X size={24} />
              </button>
              <div style={styles.modalVideoPlaceholder}>
                <Play size={64} color={NEON_GREEN} />
                <h3 style={styles.modalVideoTitle}>{videoModal.title}</h3>
                <p style={styles.modalVideoMeta}>Duration: {videoModal.duration}</p>
                <p style={styles.modalPlaceholderText}>Video player would load here</p>
              </div>
              <div style={styles.modalInfo}>
                <span style={styles.categoryBadge}>{getCategoryLabel(videoModal.category)}</span>
                <div style={styles.videoMeta}>
                  <span style={styles.metaItem}>
                    <Eye size={14} />
                    {videoModal.views.toLocaleString()} views
                  </span>
                  <span style={styles.metaItem}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    {videoModal.rating} rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .video-card:hover {
          border-color: rgba(0, 255, 133, 0.3) !important;
          transform: translateY(-2px);
        }
        .video-card:hover .play-overlay {
          opacity: 1 !important;
        }
        .watch-btn:hover {
          opacity: 0.9;
        }
        .category-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #CCCCCC;
        }
        .download-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .register-btn:hover {
          background-color: rgba(0, 255, 133, 0.2);
        }
        @media (max-width: 768px) {
          .how-to-sidebar {
            display: none !important;
          }
          .how-to-main {
            padding: 16px !important;
          }
          .video-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#000000',
  },
  progressBanner: {
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    borderBottom: `1px solid rgba(0, 255, 133, 0.2)`,
    padding: '16px 32px',
  },
  progressContent: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  progressInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  progressBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  mainContent: {
    display: 'flex',
    maxWidth: 1400,
    margin: '0 auto',
    padding: '32px',
    gap: 32,
  },
  sidebar: {
    width: 280,
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 16,
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    width: '100%',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
  },
  categoryLabel: {
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    padding: '2px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
  },
  videoCount: {
    fontSize: 14,
    color: '#666666',
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
    marginBottom: 48,
  },
  videoCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  playButton: {
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEON_GREEN,
    borderRadius: '50%',
    transition: 'transform 0.2s',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    fontSize: 12,
    color: '#FFFFFF',
  },
  watchedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 255, 133, 0.9)',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    color: '#000000',
  },
  videoInfo: {
    padding: 16,
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 500,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
    lineHeight: 1.4,
  },
  videoMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#666666',
  },
  watchButton: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    color: '#000000',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  resourcesSection: {
    marginBottom: 48,
    paddingTop: 32,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  resourceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 10,
    flexShrink: 0,
  },
  resourceInfo: {
    flex: 1,
    minWidth: 0,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  resourceMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    fontSize: 13,
    color: '#CCCCCC',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },
  webinarsSection: {
    paddingTop: 32,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  webinarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 20,
  },
  webinarCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  webinarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  webinarDate: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#CCCCCC',
  },
  webinarTime: {
    fontSize: 13,
    color: '#666666',
  },
  webinarTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  webinarMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  webinarHost: {
    fontSize: 13,
    color: '#666666',
  },
  webinarSpots: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: NEON_GREEN,
  },
  registerButton: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.3)`,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 24,
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${CARD_BORDER}`,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    color: '#FFFFFF',
    cursor: 'pointer',
    zIndex: 10,
  },
  modalVideoPlaceholder: {
    aspectRatio: '16/9',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  modalVideoTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    textAlign: 'center',
    padding: '0 24px',
  },
  modalVideoMeta: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
  },
  modalPlaceholderText: {
    fontSize: 14,
    color: '#444444',
    margin: 0,
  },
  modalInfo: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
};
