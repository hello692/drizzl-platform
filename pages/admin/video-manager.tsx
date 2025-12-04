import React, { useState, useEffect } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import { Video } from '../../lib/videoManagerService';
import AdminLayout from '../../components/AdminLayout';

type TabType = 'experts' | 'testimonials' | 'videos';
type ModalMode = 'add' | 'edit' | 'delete' | 'preview' | null;

interface Expert {
  id: string;
  photoUrl: string;
  name: string;
  credentials: string;
  product: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: string;
  photoUrl: string;
  name: string;
  videoUrl: string;
  product: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const INITIAL_EXPERTS: Expert[] = [
  {
    id: 'exp-001',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    name: 'Dr. Gabrielle Wade',
    credentials: 'MD, Dermatologist',
    product: 'Matcha',
    position: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-002',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    name: 'Dr. Sarah Martinez',
    credentials: 'PhD, Nutritionist',
    product: 'Strawberry + Peach',
    position: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-003',
    photoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
    name: 'Elizabeth Rousseau',
    credentials: 'FNP-C, APRN',
    product: 'Pink Piyata',
    position: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-004',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    name: 'Morgan Buckley',
    credentials: 'LII',
    product: 'Coffee Mushroom',
    position: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-001',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    name: 'Sarah Butler',
    videoUrl: '',
    product: 'Almond',
    position: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-002',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    name: 'Jessica Chen',
    videoUrl: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview',
    product: 'Acai',
    position: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-003',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    name: 'Taylor Kay',
    videoUrl: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview',
    product: 'Chocolate Berry',
    position: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-004',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    name: 'Brittany Salderly',
    videoUrl: '',
    product: 'Mocha',
    position: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ContentManagerDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('experts');

  const [videos, setVideos] = useState<Video[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const [videoFormData, setVideoFormData] = useState({
    url: '',
    caption: '',
    autoplay: false,
    loop: false,
    platform: 'both' as 'desktop' | 'mobile' | 'both',
  });

  const [expertFormData, setExpertFormData] = useState({
    photoUrl: '',
    name: '',
    credentials: '',
    product: '',
  });

  const [testimonialFormData, setTestimonialFormData] = useState({
    photoUrl: '',
    name: '',
    videoUrl: '',
    product: '',
  });

  useEffect(() => {
    if (authorized) {
      loadAllData();
    }
  }, [authorized]);

  async function loadAllData() {
    try {
      const [videosRes, expertsRes, testimonialsRes] = await Promise.all([
        fetch('/api/admin/video-manager'),
        fetch('/api/admin/experts'),
        fetch('/api/admin/testimonials'),
      ]);

      const videosData = await videosRes.json();
      const expertsData = await expertsRes.json();
      const testimonialsData = await testimonialsRes.json();

      if (videosData.success) {
        setVideos(videosData.data || []);
      }

      if (expertsData.success && expertsData.data) {
        setExperts(expertsData.data.map((e: any) => ({
          id: e.id,
          photoUrl: e.photo_url || '',
          name: e.name,
          credentials: e.credentials || '',
          product: e.product || '',
          position: e.position,
          isActive: e.is_active,
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        })));
      }

      if (testimonialsData.success && testimonialsData.data) {
        setTestimonials(testimonialsData.data.map((t: any) => ({
          id: t.id,
          photoUrl: t.photo_url || '',
          name: t.name,
          videoUrl: t.video_url || '',
          product: t.product || '',
          position: t.position,
          isActive: t.is_active,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  async function loadVideos() {
    try {
      const response = await fetch('/api/admin/video-manager');
      const data = await response.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  const closeModal = () => {
    setModalMode(null);
    setSelectedVideo(null);
    setSelectedExpert(null);
    setSelectedTestimonial(null);
  };

  const openAddModal = () => {
    if (activeTab === 'videos') {
      setVideoFormData({ url: '', caption: '', autoplay: false, loop: false, platform: 'both' });
      setSelectedVideo(null);
    } else if (activeTab === 'experts') {
      setExpertFormData({ photoUrl: '', name: '', credentials: '', product: '' });
      setSelectedExpert(null);
    } else {
      setTestimonialFormData({ photoUrl: '', name: '', videoUrl: '', product: '' });
      setSelectedTestimonial(null);
    }
    setModalMode('add');
  };

  const openEditModal = (item: Video | Expert | Testimonial) => {
    if (activeTab === 'videos') {
      const video = item as Video;
      setVideoFormData({
        url: video.url,
        caption: video.caption,
        autoplay: video.autoplay,
        loop: video.loop,
        platform: video.platform,
      });
      setSelectedVideo(video);
    } else if (activeTab === 'experts') {
      const expert = item as Expert;
      setExpertFormData({
        photoUrl: expert.photoUrl,
        name: expert.name,
        credentials: expert.credentials,
        product: expert.product,
      });
      setSelectedExpert(expert);
    } else {
      const testimonial = item as Testimonial;
      setTestimonialFormData({
        photoUrl: testimonial.photoUrl,
        name: testimonial.name,
        videoUrl: testimonial.videoUrl,
        product: testimonial.product,
      });
      setSelectedTestimonial(testimonial);
    }
    setModalMode('edit');
  };

  const openDeleteModal = (item: Video | Expert | Testimonial) => {
    if (activeTab === 'videos') {
      setSelectedVideo(item as Video);
    } else if (activeTab === 'experts') {
      setSelectedExpert(item as Expert);
    } else {
      setSelectedTestimonial(item as Testimonial);
    }
    setModalMode('delete');
  };

  const openPreviewModal = (video: Video) => {
    setSelectedVideo(video);
    setModalMode('preview');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'videos') {
        if (modalMode === 'add') {
          const response = await fetch('/api/admin/video-manager', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videoFormData),
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
            body: JSON.stringify(videoFormData),
          });
          const data = await response.json();
          if (data.success) {
            await loadVideos();
            closeModal();
          }
        }
      } else if (activeTab === 'experts') {
        if (modalMode === 'add') {
          const response = await fetch('/api/admin/experts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: expertFormData.name,
              credentials: expertFormData.credentials,
              photo_url: expertFormData.photoUrl,
              product: expertFormData.product,
            }),
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            closeModal();
          }
        } else if (modalMode === 'edit' && selectedExpert) {
          const response = await fetch(`/api/admin/experts/${selectedExpert.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: expertFormData.name,
              credentials: expertFormData.credentials,
              photo_url: expertFormData.photoUrl,
              product: expertFormData.product,
            }),
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            closeModal();
          }
        }
      } else {
        if (modalMode === 'add') {
          const response = await fetch('/api/admin/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: testimonialFormData.name,
              photo_url: testimonialFormData.photoUrl,
              video_url: testimonialFormData.videoUrl,
              product: testimonialFormData.product,
            }),
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            closeModal();
          }
        } else if (modalMode === 'edit' && selectedTestimonial) {
          const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: testimonialFormData.name,
              photo_url: testimonialFormData.photoUrl,
              video_url: testimonialFormData.videoUrl,
              product: testimonialFormData.product,
            }),
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            closeModal();
          }
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      if (activeTab === 'videos' && selectedVideo) {
        const response = await fetch(`/api/admin/video-manager/${selectedVideo.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          await loadVideos();
          closeModal();
        }
      } else if (activeTab === 'experts' && selectedExpert) {
        const response = await fetch(`/api/admin/experts/${selectedExpert.id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          await loadAllData();
          closeModal();
        }
      } else if (activeTab === 'testimonials' && selectedTestimonial) {
        const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          await loadAllData();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: Video | Expert | Testimonial) => {
    if (activeTab === 'videos') {
      const video = item as Video;
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
    } else if (activeTab === 'experts') {
      const expert = item as Expert;
      try {
        const response = await fetch(`/api/admin/experts/${expert.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !expert.isActive }),
        });
        const data = await response.json();
        if (data.success) {
          setExperts(prev => prev.map(e => e.id === expert.id ? { ...e, isActive: !e.isActive } : e));
        }
      } catch (error) {
        console.error('Error toggling expert:', error);
      }
    } else {
      const testimonial = item as Testimonial;
      try {
        const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !testimonial.isActive }),
        });
        const data = await response.json();
        if (data.success) {
          setTestimonials(prev => prev.map(t => t.id === testimonial.id ? { ...t, isActive: !t.isActive } : t));
        }
      } catch (error) {
        console.error('Error toggling testimonial:', error);
      }
    }
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const getCurrentList = () => {
      if (activeTab === 'videos') return videos;
      if (activeTab === 'experts') return experts;
      return testimonials;
    };

    const list = getCurrentList();
    const index = list.findIndex((item: any) => item.id === itemId);

    if (direction === 'up' && index > 0) {
      const newList = [...list];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      const updatedList = newList.map((item: any, i) => ({ ...item, position: i + 1 }));

      if (activeTab === 'videos') {
        setVideos(updatedList as Video[]);
      } else if (activeTab === 'experts') {
        setExperts(updatedList as Expert[]);
      } else {
        setTestimonials(updatedList as Testimonial[]);
      }
      setHasChanges(true);
    } else if (direction === 'down' && index < list.length - 1) {
      const newList = [...list];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      const updatedList = newList.map((item: any, i) => ({ ...item, position: i + 1 }));

      if (activeTab === 'videos') {
        setVideos(updatedList as Video[]);
      } else if (activeTab === 'experts') {
        setExperts(updatedList as Expert[]);
      } else {
        setTestimonials(updatedList as Testimonial[]);
      }
      setHasChanges(true);
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const getCurrentList = () => {
      if (activeTab === 'videos') return videos;
      if (activeTab === 'experts') return experts;
      return testimonials;
    };

    const list = getCurrentList();
    const draggedIndex = list.findIndex((item: any) => item.id === draggedId);
    const targetIndex = list.findIndex((item: any) => item.id === targetId);

    const newList = [...list];
    const [removed] = newList.splice(draggedIndex, 1);
    newList.splice(targetIndex, 0, removed);
    const updatedList = newList.map((item: any, i) => ({ ...item, position: i + 1 }));

    if (activeTab === 'videos') {
      setVideos(updatedList as Video[]);
    } else if (activeTab === 'experts') {
      setExperts(updatedList as Expert[]);
    } else {
      setTestimonials(updatedList as Testimonial[]);
    }

    setHasChanges(true);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      if (activeTab === 'videos') {
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
      } else if (activeTab === 'experts') {
        const order = experts.map(e => e.id);
        const response = await fetch('/api/admin/experts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        });
        const data = await response.json();
        if (data.success) {
          setHasChanges(false);
        }
      } else if (activeTab === 'testimonials') {
        const order = testimonials.map(t => t.id);
        const response = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        });
        const data = await response.json();
        if (data.success) {
          setHasChanges(false);
        }
      }
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Content Manager" subtitle="Landing Page CMS">
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Initializing</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Content Manager" subtitle="Landing Page CMS">
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Authenticating</p>
        </div>
      </AdminLayout>
    );
  }

  const getActiveCount = () => {
    if (activeTab === 'videos') return videos.filter(v => v.isActive).length;
    if (activeTab === 'experts') return experts.filter(e => e.isActive).length;
    return testimonials.filter(t => t.isActive).length;
  };

  const getTotalCount = () => {
    if (activeTab === 'videos') return videos.length;
    if (activeTab === 'experts') return experts.length;
    return testimonials.length;
  };

  const getAddButtonText = () => {
    if (activeTab === 'videos') return 'Add Video';
    if (activeTab === 'experts') return 'Add Expert';
    return 'Add Testimonial';
  };

  const getSelectedItem = () => {
    if (activeTab === 'videos') return selectedVideo;
    if (activeTab === 'experts') return selectedExpert;
    return selectedTestimonial;
  };

  const getSelectedItemName = () => {
    const item = getSelectedItem();
    if (!item) return '';
    if (activeTab === 'videos') return (item as Video).caption;
    return (item as Expert | Testimonial).name;
  };

  const canSave = () => {
    if (activeTab === 'videos') {
      return videoFormData.url && videoFormData.caption;
    } else if (activeTab === 'experts') {
      return expertFormData.name && expertFormData.credentials;
    } else {
      return testimonialFormData.name && testimonialFormData.product;
    }
  };

  return (
    <AdminLayout title="Content Manager" subtitle="Landing Page CMS">
      <div style={styles.tabContainer}>
        <div style={styles.tabNav}>
          <button
            onClick={() => { setActiveTab('experts'); setHasChanges(false); }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'experts' ? styles.tabBtnActive : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Expert Reviewers
            {activeTab === 'experts' && <div style={styles.tabIndicator} />}
          </button>
          <button
            onClick={() => { setActiveTab('testimonials'); setHasChanges(false); }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'testimonials' ? styles.tabBtnActive : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Customer Testimonials
            {activeTab === 'testimonials' && <div style={styles.tabIndicator} />}
          </button>
          <button
            onClick={() => { setActiveTab('videos'); setHasChanges(false); }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'videos' ? styles.tabBtnActive : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9l5 3-5 3V9z" />
            </svg>
            Website Videos
            {activeTab === 'videos' && <div style={styles.tabIndicator} />}
          </button>
        </div>
      </div>

      <div style={styles.pageHeader}>
        <div style={styles.headerInfo}>
          <p style={styles.videoCount}>{getActiveCount()} active of {getTotalCount()} total</p>
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
            {getAddButtonText()}
          </button>
        </div>
      </div>

      {loadingData ? (
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading content...</p>
        </div>
      ) : (
        <>
          {activeTab === 'experts' && (
            <>
              {experts.length === 0 ? (
                <EmptyState type="experts" onAdd={openAddModal} />
              ) : (
                <div style={styles.cardsGrid}>
                  {experts.map((expert, index) => (
                    <ExpertCard
                      key={expert.id}
                      expert={expert}
                      index={index}
                      totalItems={experts.length}
                      draggedId={draggedId}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onToggleActive={toggleActive}
                      onMove={moveItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'testimonials' && (
            <>
              {testimonials.length === 0 ? (
                <EmptyState type="testimonials" onAdd={openAddModal} />
              ) : (
                <div style={styles.cardsGrid}>
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      index={index}
                      totalItems={testimonials.length}
                      draggedId={draggedId}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onToggleActive={toggleActive}
                      onMove={moveItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'videos' && (
            <>
              {videos.length === 0 ? (
                <EmptyState type="videos" onAdd={openAddModal} />
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
                      onToggleActive={toggleActive}
                      onMove={moveItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
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

          {modalMode === 'delete' && getSelectedItem() && (
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
                <h3 style={styles.deleteTitle}>Delete {activeTab === 'videos' ? 'Video' : activeTab === 'experts' ? 'Expert' : 'Testimonial'}</h3>
                <p style={styles.deleteDesc}>
                  Are you sure you want to delete &quot;{getSelectedItemName()}&quot;? This action cannot be undone.
                </p>
                <div style={styles.modalActions}>
                  <button onClick={closeModal} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
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
                  {modalMode === 'add' ? `Add New ${activeTab === 'videos' ? 'Video' : activeTab === 'experts' ? 'Expert' : 'Testimonial'}` : `Edit ${activeTab === 'videos' ? 'Video' : activeTab === 'experts' ? 'Expert' : 'Testimonial'}`}
                </h3>

                <div style={styles.formContent}>
                  {activeTab === 'videos' && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Video URL</label>
                        <input
                          type="url"
                          value={videoFormData.url}
                          onChange={(e) => setVideoFormData(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://example.com/video.mp4"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Caption</label>
                        <input
                          type="text"
                          value={videoFormData.caption}
                          onChange={(e) => setVideoFormData(prev => ({ ...prev, caption: e.target.value }))}
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
                              onClick={() => setVideoFormData(prev => ({ ...prev, platform }))}
                              style={{
                                ...styles.platformBtn,
                                background: videoFormData.platform === platform
                                  ? 'linear-gradient(135deg, rgba(255, 8, 68, 0.2) 0%, rgba(255, 177, 153, 0.2) 100%)'
                                  : 'rgba(255,255,255,0.03)',
                                borderColor: videoFormData.platform === platform
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
                            onClick={() => setVideoFormData(prev => ({ ...prev, autoplay: !prev.autoplay }))}
                            style={{
                              ...styles.toggleBtn,
                              background: videoFormData.autoplay
                                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                : 'rgba(255,255,255,0.1)',
                            }}
                          >
                            <div style={{
                              ...styles.toggleKnob,
                              left: videoFormData.autoplay ? '22px' : '2px',
                            }} />
                          </button>
                          <span style={styles.toggleText}>Autoplay</span>
                        </label>

                        <label style={styles.toggleLabel}>
                          <button
                            type="button"
                            onClick={() => setVideoFormData(prev => ({ ...prev, loop: !prev.loop }))}
                            style={{
                              ...styles.toggleBtn,
                              background: videoFormData.loop
                                ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                                : 'rgba(255,255,255,0.1)',
                            }}
                          >
                            <div style={{
                              ...styles.toggleKnob,
                              left: videoFormData.loop ? '22px' : '2px',
                            }} />
                          </button>
                          <span style={styles.toggleText}>Loop</span>
                        </label>
                      </div>
                    </>
                  )}

                  {activeTab === 'experts' && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Photo URL</label>
                        <input
                          type="url"
                          value={expertFormData.photoUrl}
                          onChange={(e) => setExpertFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                          placeholder="https://example.com/photo.jpg"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                          type="text"
                          value={expertFormData.name}
                          onChange={(e) => setExpertFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Dr. Gabrielle Wade"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Credentials</label>
                        <input
                          type="text"
                          value={expertFormData.credentials}
                          onChange={(e) => setExpertFormData(prev => ({ ...prev, credentials: e.target.value }))}
                          placeholder="MD, Dermatologist"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Associated Product</label>
                        <input
                          type="text"
                          value={expertFormData.product}
                          onChange={(e) => setExpertFormData(prev => ({ ...prev, product: e.target.value }))}
                          placeholder="Tropical Dreams Protein"
                          style={styles.input}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'testimonials' && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Photo URL</label>
                        <input
                          type="url"
                          value={testimonialFormData.photoUrl}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                          placeholder="https://example.com/photo.jpg"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Customer Name</label>
                        <input
                          type="text"
                          value={testimonialFormData.name}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Sarah Butler"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Video URL (Optional)</label>
                        <input
                          type="url"
                          value={testimonialFormData.videoUrl}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="https://example.com/testimonial-video.mp4"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Associated Product</label>
                        <input
                          type="text"
                          value={testimonialFormData.product}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, product: e.target.value }))}
                          placeholder="Pink Piyata"
                          style={styles.input}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div style={styles.modalActions}>
                  <button onClick={closeModal} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !canSave()}
                    style={{
                      ...styles.saveBtn,
                      opacity: (saving || !canSave()) ? 0.5 : 1,
                      cursor: (saving || !canSave()) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving ? 'Saving...' : modalMode === 'add' ? getAddButtonText() : 'Save Changes'}
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

function EmptyState({ type, onAdd }: { type: 'experts' | 'testimonials' | 'videos'; onAdd: () => void }) {
  const config = {
    experts: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#emptyGrad)" strokeWidth="1.5">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0844" />
              <stop offset="100%" stopColor="#ffb199" />
            </linearGradient>
          </defs>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: 'No experts yet',
      desc: 'Add your first expert reviewer to get started',
      btn: 'Add Expert',
    },
    testimonials: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#emptyGrad)" strokeWidth="1.5">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0844" />
              <stop offset="100%" stopColor="#ffb199" />
            </linearGradient>
          </defs>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: 'No testimonials yet',
      desc: 'Add your first customer testimonial to get started',
      btn: 'Add Testimonial',
    },
    videos: {
      icon: (
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
      ),
      title: 'No videos yet',
      desc: 'Add your first video to get started',
      btn: 'Add Video',
    },
  };

  const { icon, title, desc, btn } = config[type];

  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>{icon}</div>
      <h3 style={styles.emptyTitle}>{title}</h3>
      <p style={styles.emptyDesc}>{desc}</p>
      <button onClick={onAdd} style={styles.emptyAddBtn}>{btn}</button>
    </div>
  );
}

function ExpertCard({
  expert,
  index,
  totalItems,
  draggedId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
}: {
  expert: Expert;
  index: number;
  totalItems: number;
  draggedId: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onEdit: (item: Expert) => void;
  onDelete: (item: Expert) => void;
  onToggleActive: (item: Expert) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, expert.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, expert.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.contentCard,
        opacity: !expert.isActive ? 0.5 : 1,
        transform: draggedId === expert.id ? 'scale(1.02)' : hovered ? 'translateY(-4px)' : 'scale(1)',
        boxShadow: draggedId === expert.id
          ? '0 20px 40px rgba(255, 8, 68, 0.2)'
          : hovered
            ? '0 16px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div style={styles.cardGradientBorder} />
      <div style={styles.cardInner}>
        <div style={styles.expertHeader}>
          <div style={styles.expertPhotoContainer}>
            <img
              src={expert.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'}
              alt={expert.name}
              style={styles.expertPhoto}
            />
            <div style={styles.positionBadgeSmall}>
              <span style={styles.positionText}>{expert.position}</span>
            </div>
          </div>
          <button
            onClick={() => onToggleActive(expert)}
            style={{
              ...styles.activeToggle,
              background: expert.isActive
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                : 'rgba(255,255,255,0.1)',
            }}
          >
            <div style={{
              ...styles.activeToggleKnob,
              left: expert.isActive ? '22px' : '2px',
            }} />
          </button>
        </div>

        <div style={styles.expertInfo}>
          <h3 style={styles.expertName}>{expert.name}</h3>
          <span style={styles.expertCredentials}>{expert.credentials}</span>
          <div style={styles.productTag}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
            {expert.product}
          </div>
        </div>

        <div style={styles.cardActions}>
          <div style={styles.moveButtons}>
            <button
              onClick={() => onMove(expert.id, 'up')}
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
              onClick={() => onMove(expert.id, 'down')}
              disabled={index === totalItems - 1}
              style={{
                ...styles.moveBtn,
                opacity: index === totalItems - 1 ? 0.3 : 1,
                cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <div style={styles.actionButtons}>
            <button onClick={() => onEdit(expert)} style={styles.editBtn}>Edit</button>
            <button onClick={() => onDelete(expert)} style={styles.delBtn}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  totalItems,
  draggedId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
}: {
  testimonial: Testimonial;
  index: number;
  totalItems: number;
  draggedId: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (item: Testimonial) => void;
  onToggleActive: (item: Testimonial) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, testimonial.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, testimonial.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.contentCard,
        opacity: !testimonial.isActive ? 0.5 : 1,
        transform: draggedId === testimonial.id ? 'scale(1.02)' : hovered ? 'translateY(-4px)' : 'scale(1)',
        boxShadow: draggedId === testimonial.id
          ? '0 20px 40px rgba(255, 8, 68, 0.2)'
          : hovered
            ? '0 16px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div style={styles.cardGradientBorder} />
      <div style={styles.cardInner}>
        <div style={styles.expertHeader}>
          <div style={styles.expertPhotoContainer}>
            <img
              src={testimonial.photoUrl || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'}
              alt={testimonial.name}
              style={styles.expertPhoto}
            />
            <div style={styles.positionBadgeSmall}>
              <span style={styles.positionText}>{testimonial.position}</span>
            </div>
            {testimonial.videoUrl && (
              <div style={styles.videoBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            )}
          </div>
          <button
            onClick={() => onToggleActive(testimonial)}
            style={{
              ...styles.activeToggle,
              background: testimonial.isActive
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                : 'rgba(255,255,255,0.1)',
            }}
          >
            <div style={{
              ...styles.activeToggleKnob,
              left: testimonial.isActive ? '22px' : '2px',
            }} />
          </button>
        </div>

        <div style={styles.expertInfo}>
          <h3 style={styles.expertName}>{testimonial.name}</h3>
          <div style={styles.productTag}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
            {testimonial.product}
          </div>
        </div>

        <div style={styles.cardActions}>
          <div style={styles.moveButtons}>
            <button
              onClick={() => onMove(testimonial.id, 'up')}
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
              onClick={() => onMove(testimonial.id, 'down')}
              disabled={index === totalItems - 1}
              style={{
                ...styles.moveBtn,
                opacity: index === totalItems - 1 ? 0.3 : 1,
                cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <div style={styles.actionButtons}>
            <button onClick={() => onEdit(testimonial)} style={styles.editBtn}>Edit</button>
            <button onClick={() => onDelete(testimonial)} style={styles.delBtn}>Delete</button>
          </div>
        </div>
      </div>
    </div>
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
  tabContainer: {
    marginBottom: '32px',
  },
  tabNav: {
    display: 'flex',
    gap: '8px',
    padding: '6px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
  },
  tabBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabBtnActive: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '3px',
    borderRadius: '2px',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
  },
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  contentCard: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'grab',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
  expertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 20px 16px 20px',
  },
  expertPhotoContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  expertPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '2px solid rgba(255,255,255,0.1)',
  },
  positionBadgeSmall: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 8, 68, 0.3)',
  },
  videoBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(79, 172, 254, 0.4)',
  },
  expertInfo: {
    padding: '0 20px 20px 20px',
  },
  expertName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#fff',
  },
  expertCredentials: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: '12px',
  },
  productTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
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
    flexShrink: 0,
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
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
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
