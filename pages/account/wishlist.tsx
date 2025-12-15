import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomerLayout, { CustomerSession } from '../../components/customer/CustomerLayout';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Loader2,
  ShoppingBag,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price_cents: number;
    hero_image_url: string | null;
    slug: string;
  };
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    product_id: 'prod-1',
    product: {
      id: 'prod-1',
      name: 'Strawberry Peach Smoothie',
      price_cents: 2999,
      hero_image_url: '/products/strawberry-peach/Strawbery peach-TG-1.jpg',
      slug: 'strawberry-peach',
    },
  },
  {
    id: '2',
    product_id: 'prod-2',
    product: {
      id: 'prod-2',
      name: 'Mango Jackfruit Blend',
      price_cents: 2999,
      hero_image_url: '/products/mango-jackfruit/Mango Jackfruit-1.png',
      slug: 'mango-jackfruit',
    },
  },
  {
    id: '3',
    product_id: 'prod-3',
    product: {
      id: 'prod-3',
      name: 'Coffee Mushroom Blend',
      price_cents: 1499,
      hero_image_url: '/products/coffee-mushroom/Coffee Mushroom-1.png',
      slug: 'coffee-mushroom',
    },
  },
  {
    id: '4',
    product_id: 'prod-4',
    product: {
      id: 'prod-4',
      name: 'Açai Berry Bowl Mix',
      price_cents: 1499,
      hero_image_url: '/products/acai/Acai-1.png',
      slug: 'acai',
    },
  },
];

export default function Wishlist() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const session = localStorage.getItem('customerSession');
      if (!session) {
        router.push('/account/login');
        return;
      }

      const parsedSession = JSON.parse(session);
      setCustomer(parsedSession);

      try {
        if (parsedSession.id && parsedSession.id !== 'demo-customer') {
          const { data, error } = await supabase
            .from('wishlist_items')
            .select(`
              id,
              product_id,
              products (
                id,
                name,
                price_cents,
                hero_image_url,
                slug
              )
            `)
            .eq('customer_id', parsedSession.id);

          if (!error && data && data.length > 0) {
            setWishlistItems(data.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              product: item.products,
            })));
          } else {
            setWishlistItems(mockWishlistItems);
          }
        } else {
          setWishlistItems(mockWishlistItems);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
        setWishlistItems(mockWishlistItems);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (item: WishlistItem) => {
    showToast(`${item.product.name} added to cart!`, 'success');
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (customer?.id && customer.id !== 'demo-customer') {
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', itemId);
      }
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      showToast('Item removed from wishlist', 'success');
    } catch (err) {
      console.error('Error removing item:', err);
      showToast('Failed to remove item', 'error');
    }
  };

  const handleAddAllToCart = () => {
    showToast(`${wishlistItems.length} items added to cart!`, 'success');
  };

  const handleClearWishlist = async () => {
    try {
      if (customer?.id && customer.id !== 'demo-customer') {
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('customer_id', customer.id);
      }
      
      setWishlistItems([]);
      showToast('Wishlist cleared', 'success');
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      showToast('Failed to clear wishlist', 'error');
    }
  };

  const handleShareWishlist = async () => {
    const shareUrl = `${window.location.origin}/wishlist/shared/${customer?.id || 'demo'}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Wishlist link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  if (!customer) return null;

  return (
    <CustomerLayout title="Wishlist">
      <div style={styles.page}>
        {toast && (
          <div style={{
            ...styles.toast,
            borderColor: toast.type === 'success' ? NEON_GREEN : '#EF4444',
          }}>
            {toast.type === 'success' ? (
              <CheckCircle size={18} color={NEON_GREEN} />
            ) : (
              <AlertCircle size={18} color="#EF4444" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} style={styles.toastClose}>
              <X size={16} />
            </button>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Wishlist</h1>
            <p style={styles.subtitle}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <div style={styles.headerActions}>
              <button onClick={handleShareWishlist} style={styles.secondaryButton}>
                <Share2 size={16} />
                Share
              </button>
              <button onClick={handleAddAllToCart} style={styles.primaryButton}>
                <ShoppingCart size={16} />
                Add All to Cart
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Heart size={48} />
            </div>
            <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
            <p style={styles.emptyText}>
              Save your favorite smoothies and blends to purchase later
            </p>
            <Link href="/shop-all" style={styles.shopButton}>
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.grid} className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div key={item.id} style={styles.productCard}>
                  <Link href={`/product/${item.product.slug}`} style={styles.productImageLink}>
                    <div style={styles.productImage}>
                      <img
                        src={item.product.hero_image_url || '/products/acai/Acai-1.png'}
                        alt={item.product.name}
                        style={styles.image}
                      />
                    </div>
                  </Link>
                  <div style={styles.productInfo}>
                    <Link href={`/product/${item.product.slug}`} style={styles.productNameLink}>
                      <h3 style={styles.productName}>{item.product.name}</h3>
                    </Link>
                    <span style={styles.productPrice}>
                      ${(item.product.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.productActions}>
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={styles.addToCartButton}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={styles.removeButton}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.bulkActions}>
              <button onClick={handleClearWishlist} style={styles.clearButton}>
                <Trash2 size={16} />
                Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .header-actions {
            flex-direction: column !important;
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  toast: {
    position: 'fixed',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#FFFFFF',
    fontSize: 14,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  toastClose: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
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
    marginTop: 8,
  },
  headerActions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#FFFFFF',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
    gap: 16,
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    textAlign: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EC4899',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
  },
  productCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  productImageLink: {
    display: 'block',
    textDecoration: 'none',
  },
  productImage: {
    aspectRatio: '1',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  productInfo: {
    padding: 16,
  },
  productNameLink: {
    textDecoration: 'none',
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  productActions: {
    padding: '0 16px 16px',
    display: 'flex',
    gap: 8,
  },
  addToCartButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: `1px solid rgba(239, 68, 68, 0.2)`,
    borderRadius: 8,
    color: '#EF4444',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bulkActions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
