import React, { useState, useEffect } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import { Video } from '../../lib/videoManagerService';
import AdminLayout from '../../components/AdminLayout';

type ModalMode = 'add' | 'edit' | 'delete' | 'preview' | null;

export default function VideoManagerDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    autoplay: false,
    loop: false,
    platform: 'both' as 'desktop' | 'mobile' | 'both',
  });

  useEffect(() => {
    if (authorized) {
      loadVideos();
    }
  }, [authorized]);

  async function loadVideos() {
    try {
      const response = await fetch('/api/admin/video-manager');
      const data = await response.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoadingData(false);
    }
  }

  const openAddModal = () => {
    setFormData({ url: '', caption: '', autoplay: false, loop: false, platform: 'both' });
    setSelectedVideo(null);
    setModalMode('add');
  };

  const openEditModal = (video: Video) => {
    setFormData({
      url: video.url,
      caption: video.caption,
      autoplay: video.autoplay,
      loop: video.loop,
      platform: video.platform,
    });
    setSelectedVideo(video);
    setModalMode('edit');
  };

  const openDeleteModal = (video: Video) => {
    setSelectedVideo(video);
    setModalMode('delete');
  };

  const openPreviewModal = (video: Video) => {
    setSelectedVideo(video);
    setModalMode('preview');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedVideo(null);
  };

  const handleSaveVideo = async () => {
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const response = await fetch('/api/admin/video-manager', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          await loadVideos();
          closeModal();
        }
      } else if (modalMode === 'edit' && selectedVideo) {
        const response = await fetch(`/api/admin/video-manager/${selectedVideo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          await loadVideos();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving video:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/video-manager/${selectedVideo.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await loadVideos();
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleVideoActive = async (video: Video) => {
    try {
      const response = await fetch(`/api/admin/video-manager/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !video.isActive }),
      });
      const data = await response.json();
      if (data.success) {
        setVideos(prev => prev.map(v => v.id === video.id ? { ...v, isActive: !v.isActive } : v));
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const moveVideo = (videoId: string, direction: 'up' | 'down') => {
    const index = videos.findIndex(v => v.id === videoId);
    if (direction === 'up' && index > 0) {
      const newVideos = [...videos];
      [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
      setVideos(newVideos.map((v, i) => ({ ...v, position: i + 1 })));
      setHasChanges(true);
    } else if (direction === 'down' && index < videos.length - 1) {
      const newVideos = [...videos];
      [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
      setVideos(newVideos.map((v, i) => ({ ...v, position: i + 1 })));
      setHasChanges(true);
    }
  };

  const handleDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedId(videoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = videos.findIndex(v => v.id === draggedId);
    const targetIndex = videos.findIndex(v => v.id === targetId);

    const newVideos = [...videos];
    const [removed] = newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, removed);

    setVideos(newVideos.map((v, i) => ({ ...v, position: i + 1 })));
    setHasChanges(true);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const order = videos.map(v => v.id);
      const response = await fetch('/api/admin/video-manager', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      const data = await response.json();
      if (data.success) {
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Video Manager" subtitle="Landing Page CMS">
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Initializing</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Video Manager" subtitle="Landing Page CMS">
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Authenticating</p>
        </div>
      </AdminLayout>
    );
  }

  const activeCount = videos.filter(v => v.isActive).length;

  return (
    <AdminLayout title="Video Manager" subtitle="Landing Page CMS">
      <div style={styles.pageHeader}>
        <div style={styles.headerInfo}>
          <p style={styles.videoCount}>{activeCount} active of {videos.length} total</p>
        </div>
        <div style={styles.headerActions}>
          {hasChanges && (
            <button
              onClick={saveOrder}
              disabled={saving}
              style={styles.saveOrderBtn}
            >
              <span style={styles.saveOrderGlow} />
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          )}
          <button onClick={openAddModal} style={styles.addBtn}>
            <span style={styles.addBtnIcon}>+</span>
            Add Video
          </button>
        </div>
      </div>

      {loadingData ? (
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#emptyGrad)" strokeWidth="1.5">
              <defs>
                <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff0844" />
                  <stop offset="100%" stopColor="#ffb199" />
                </linearGradient>
              </defs>
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No videos yet</h3>
          <p style={styles.emptyDesc}>Add your first video to get started</p>
          <button onClick={openAddModal} style={styles.emptyAddBtn}>
            Add Video
          </button>
        </div>
      ) : (
        <div style={styles.videosGrid}>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              totalVideos={videos.length}
              draggedId={draggedId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onPreview={openPreviewModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onToggleActive={toggleVideoActive}
              onMove={moveVideo}
            />
          ))}
        </div>
      )}

      {modalMode && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={styles.modalOverlay}
        >
          {modalMode === 'preview' && selectedVideo && (
            <div style={styles.previewModal}>
              <div style={styles.previewModalGradientBorder} />
              <div style={styles.previewModalInner}>
                <div style={styles.previewHeader}>
                  <h3 style={styles.previewTitle}>{selectedVideo.caption}</h3>
                  <button onClick={closeModal} style={styles.closeBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div style={styles.previewContent}>
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay={selectedVideo.autoplay}
                    loop={selectedVideo.loop}
                    style={styles.previewVideo}
                  />
                </div>
              </div>
            </div>
          )}

          {modalMode === 'delete' && selectedVideo && (
            <div style={styles.deleteModal}>
              <div style={styles.modalGradientBorder} />
              <div style={styles.modalInner}>
                <div style={styles.deleteIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#deleteGrad)" strokeWidth="2">
                    <defs>
                      <linearGradient id="deleteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff0844" />
                        <stop offset="100%" stopColor="#ff6b6b" />
                      </linearGradient>
                    </defs>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <h3 style={styles.deleteTitle}>Delete Video</h3>
                <p style={styles.deleteDesc}>
                  Are you sure you want to delete &quot;{selectedVideo.caption}&quot;? This action cannot be undone.
                </p>
                <div style={styles.modalActions}>
                  <button onClick={closeModal} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteVideo}
                    disabled={saving}
                    style={{
                      ...styles.deleteBtn,
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {(modalMode === 'add' || modalMode === 'edit') && (
            <div style={styles.formModal}>
              <div style={styles.modalGradientBorder} />
              <div style={styles.modalInner}>
                <h3 style={styles.formTitle}>
                  {modalMode === 'add' ? 'Add New Video' : 'Edit Video'}
                </h3>

                <div style={styles.formContent}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Video URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com/video.mp4"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Caption</label>
                    <input
                      type="text"
                      value={formData.caption}
                      onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Hero video, product showcase, etc."
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Platform Optimization</label>
                    <div style={styles.platformBtns}>
                      {(['desktop', 'mobile', 'both'] as const).map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, platform }))}
                          style={{
                            ...styles.platformBtn,
                            background: formData.platform === platform
                              ? 'linear-gradient(135deg, rgba(255, 8, 68, 0.2) 0%, rgba(255, 177, 153, 0.2) 100%)'
                              : 'rgba(255,255,255,0.03)',
                            borderColor: formData.platform === platform
                              ? 'rgba(255, 8, 68, 0.5)'
                              : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          {platform === 'desktop' ? 'Desktop' : platform === 'mobile' ? 'Mobile' : 'Both'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.togglesRow}>
                    <label style={styles.toggleLabel}>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, autoplay: !prev.autoplay }))}
                        style={{
                          ...styles.toggleBtn,
                          background: formData.autoplay
                            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                            : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <div style={{
                          ...styles.toggleKnob,
                          left: formData.autoplay ? '22px' : '2px',
                        }} />
                      </button>
                      <span style={styles.toggleText}>Autoplay</span>
                    </label>

                    <label style={styles.toggleLabel}>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, loop: !prev.loop }))}
                        style={{
                          ...styles.toggleBtn,
                          background: formData.loop
                            ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                            : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <div style={{
                          ...styles.toggleKnob,
                          left: formData.loop ? '22px' : '2px',
                        }} />
                      </button>
                      <span style={styles.toggleText}>Loop</span>
                    </label>
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button onClick={closeModal} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVideo}
                    disabled={saving || !formData.url || !formData.caption}
                    style={{
                      ...styles.saveBtn,
                      opacity: (saving || !formData.url || !formData.caption) ? 0.5 : 1,
                      cursor: (saving || !formData.url || !formData.caption) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving ? 'Saving...' : modalMode === 'add' ? 'Add Video' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 8, 68, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 8, 68, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </AdminLayout>
  );
}

function VideoCard({
  video,
  index,
  totalVideos,
  draggedId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPreview,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
}: {
  video: Video;
  index: number;
  totalVideos: number;
  draggedId: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onPreview: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onToggleActive: (video: Video) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, video.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, video.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.videoCard,
        opacity: !video.isActive ? 0.5 : 1,
        transform: draggedId === video.id ? 'scale(1.02)' : hovered ? 'translateY(-4px)' : 'scale(1)',
        boxShadow: draggedId === video.id
          ? '0 20px 40px rgba(255, 8, 68, 0.2)'
          : hovered
            ? '0 16px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div style={styles.cardGradientBorder} />
      <div style={styles.cardInner}>
        <div style={styles.thumbnailContainer}>
          <img
            src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop'}
            alt={video.caption}
            style={styles.thumbnail}
          />
          <div style={styles.thumbnailOverlay} />

          <div style={styles.positionBadge}>
            <span style={styles.positionText}>{video.position}</span>
          </div>

          <button
            onClick={() => onPreview(video)}
            style={{
              ...styles.playBtn,
              opacity: hovered ? 1 : 0.8,
              transform: hovered ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          <div style={styles.badgesContainer}>
            {video.autoplay && (
              <span style={styles.autoplayBadge}>Autoplay</span>
            )}
            {video.loop && (
              <span style={styles.loopBadge}>Loop</span>
            )}
          </div>
        </div>

        <div style={styles.cardContent}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>{video.caption}</h3>
              <span style={styles.platformTag}>
                {video.platform === 'desktop' ? 'Desktop' : video.platform === 'mobile' ? 'Mobile' : 'All Platforms'}
              </span>
            </div>
            <button
              onClick={() => onToggleActive(video)}
              style={{
                ...styles.activeToggle,
                background: video.isActive
                  ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              <div style={{
                ...styles.activeToggleKnob,
                left: video.isActive ? '22px' : '2px',
              }} />
            </button>
          </div>

          <div style={styles.cardActions}>
            <div style={styles.moveButtons}>
              <button
                onClick={() => onMove(video.id, 'up')}
                disabled={index === 0}
                style={{
                  ...styles.moveBtn,
                  opacity: index === 0 ? 0.3 : 1,
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                onClick={() => onMove(video.id, 'down')}
                disabled={index === totalVideos - 1}
                style={{
                  ...styles.moveBtn,
                  opacity: index === totalVideos - 1 ? 0.3 : 1,
                  cursor: index === totalVideos - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <div style={styles.actionButtons}>
              <button onClick={() => onEdit(video)} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={() => onDelete(video)} style={styles.delBtn}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingOrb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  videoCount: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  saveOrderBtn: {
    position: 'relative',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  saveOrderGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.4) 0%, rgba(56, 249, 215, 0.4) 100%)',
    filter: 'blur(15px)',
    zIndex: -1,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  addBtnIcon: {
    fontSize: '18px',
    fontWeight: '400',
  },
  emptyState: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '80px 40px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  emptyIcon: {
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#fff',
  },
  emptyDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginBottom: '32px',
  },
  emptyAddBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  videoCard: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'grab',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardGradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '20px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  cardInner: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    overflow: 'hidden',
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
  thumbnailOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
    pointerEvents: 'none',
  },
  positionBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 8, 68, 0.3)',
  },
  positionText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
  },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  badgesContainer: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    gap: '6px',
  },
  autoplayBadge: {
    padding: '6px 10px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  loopBadge: {
    padding: '6px 10px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardContent: {
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#fff',
  },
  platformTag: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  activeToggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.3s ease',
  },
  activeToggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    transition: 'left 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveButtons: {
    display: 'flex',
    gap: '4px',
  },
  moveBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  delBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 8, 68, 0.2)',
    background: 'rgba(255, 8, 68, 0.1)',
    color: '#ff6b6b',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  previewModal: {
    position: 'relative',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  previewModalGradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '20px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(255, 8, 68, 0.5) 0%, rgba(255, 177, 153, 0.3) 50%, rgba(79, 172, 254, 0.5) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  previewModalInner: {
    background: 'rgba(10, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  previewTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  previewContent: {
    aspectRatio: '16/9',
  },
  previewVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#000',
  },
  deleteModal: {
    position: 'relative',
    maxWidth: '420px',
    width: '100%',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  modalGradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '20px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  modalInner: {
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
  },
  deleteIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255, 8, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  deleteTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#fff',
  },
  deleteDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff0844 0%, #ff6b6b 100%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  formModal: {
    position: 'relative',
    maxWidth: '520px',
    width: '100%',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '28px',
    color: '#fff',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '32px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  platformBtns: {
    display: 'flex',
    gap: '8px',
  },
  platformBtn: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#fff',
    transition: 'all 0.2s ease',
  },
  togglesRow: {
    display: 'flex',
    gap: '32px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  toggleBtn: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.3s ease',
  },
  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    transition: 'left 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  toggleText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  saveBtn: {
    padding: '12px 28px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
