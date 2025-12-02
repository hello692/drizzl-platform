import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { Video } from '../../lib/videoManagerService';

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  const activeCount = videos.filter(v => v.isActive).length;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/video-manager" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 1, fontWeight: '600' }}>Videos</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px', color: '#111' }}>Video Manager</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage landing page videos • {activeCount} active of {videos.length} total</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {hasChanges && (
              <button
                onClick={saveOrder}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {saving ? 'Saving...' : 'Save Order'}
              </button>
            )}
            <button
              onClick={openAddModal}
              style={{
                padding: '10px 20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '16px' }}>+</span> Add Video
            </button>
          </div>
        </div>

        {loadingData ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Loading videos...</div>
        ) : videos.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '60px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No videos yet</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Add your first video to get started</p>
            <button
              onClick={openAddModal}
              style={{
                padding: '12px 24px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Add Video
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {videos.map((video, index) => (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => handleDragStart(e, video.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, video.id)}
                onDragEnd={handleDragEnd}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: draggedId === video.id ? '0 8px 24px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                  opacity: !video.isActive ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  cursor: 'grab',
                  transform: draggedId === video.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111', overflow: 'hidden' }}>
                  <img
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop'}
                    alt={video.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#000',
                    color: '#fff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {video.position}
                  </div>
                  <button
                    onClick={() => openPreviewModal(video)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    ▶
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '6px',
                  }}>
                    {video.autoplay && (
                      <span style={{ background: '#3b82f6', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Autoplay
                      </span>
                    )}
                    {video.loop && (
                      <span style={{ background: '#8b5cf6', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Loop
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#111' }}>{video.caption}</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          background: video.platform === 'desktop' ? '#e0f2fe' : video.platform === 'mobile' ? '#fce7f3' : '#ecfdf5',
                          color: video.platform === 'desktop' ? '#0369a1' : video.platform === 'mobile' ? '#be185d' : '#047857',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}>
                          {video.platform === 'desktop' ? '🖥 Desktop' : video.platform === 'mobile' ? '📱 Mobile' : '📱🖥 Both'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleVideoActive(video)}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: video.isActive ? '#10b981' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: '2px',
                        left: video.isActive ? '22px' : '2px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => moveVideo(video.id, 'up')}
                        disabled={index === 0}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          opacity: index === 0 ? 0.4 : 1,
                          fontSize: '14px',
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveVideo(video.id, 'down')}
                        disabled={index === videos.length - 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: index === videos.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: index === videos.length - 1 ? 0.4 : 1,
                          fontSize: '14px',
                        }}
                      >
                        ↓
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(video)}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          color: '#374151',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(video)}
                        style={{
                          padding: '6px 12px',
                          background: '#fef2f2',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          color: '#dc2626',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalMode && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          {modalMode === 'preview' && selectedVideo && (
            <div style={{
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #333' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>{selectedVideo.caption}</h3>
                <button
                  onClick={closeModal}
                  style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              <div style={{ aspectRatio: '16/9' }}>
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay={selectedVideo.autoplay}
                  loop={selectedVideo.loop}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          {modalMode === 'delete' && selectedVideo && (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111' }}>Delete Video</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
                Are you sure you want to delete &quot;{selectedVideo.caption}&quot;? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}

          {(modalMode === 'add' || modalMode === 'edit') && (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111' }}>
                {modalMode === 'add' ? 'Add New Video' : 'Edit Video'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/video.mp4"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Caption
                  </label>
                  <input
                    type="text"
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Hero video, product showcase, etc."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Platform Optimization
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['desktop', 'mobile', 'both'] as const).map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, platform }))}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          border: formData.platform === platform ? '2px solid #000' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: formData.platform === platform ? '#f9fafb' : '#fff',
                          fontSize: '13px',
                          fontWeight: formData.platform === platform ? '600' : '400',
                          cursor: 'pointer',
                          color: '#111',
                        }}
                      >
                        {platform === 'desktop' ? '🖥 Desktop' : platform === 'mobile' ? '📱 Mobile' : '📱🖥 Both'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, autoplay: !prev.autoplay }))}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: formData.autoplay ? '#3b82f6' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: '2px',
                        left: formData.autoplay ? '22px' : '2px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Autoplay</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, loop: !prev.loop }))}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: formData.loop ? '#8b5cf6' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: '2px',
                        left: formData.loop ? '22px' : '2px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Loop</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVideo}
                  disabled={saving || !formData.url || !formData.caption}
                  style={{
                    padding: '10px 24px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (saving || !formData.url || !formData.caption) ? 'not-allowed' : 'pointer',
                    opacity: (saving || !formData.url || !formData.caption) ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Saving...' : modalMode === 'add' ? 'Add Video' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
