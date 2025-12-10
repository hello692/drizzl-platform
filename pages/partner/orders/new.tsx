import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../../components/partner/PartnerLayout';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  CheckCircle,
  X,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Product {
  id: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  image: string;
  minOrder: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 'prod-1', name: 'Strawberry Peach Smoothie', category: 'Smoothies', retailPrice: 8.99, wholesalePrice: 5.84, image: '🍓', minOrder: 12 },
  { id: 'prod-2', name: 'Mango Jackfruit Blend', category: 'Smoothies', retailPrice: 8.99, wholesalePrice: 5.84, image: '🥭', minOrder: 12 },
  { id: 'prod-3', name: 'Açai Berry Bowl Mix', category: 'Bowls', retailPrice: 11.99, wholesalePrice: 7.79, image: '🫐', minOrder: 12 },
  { id: 'prod-4', name: 'Green Detox Blend', category: 'Smoothies', retailPrice: 7.99, wholesalePrice: 5.19, image: '🥬', minOrder: 12 },
  { id: 'prod-5', name: 'Coffee Mushroom Blend', category: 'Specialty', retailPrice: 9.99, wholesalePrice: 6.49, image: '☕', minOrder: 12 },
  { id: 'prod-6', name: 'Tropical Paradise Mix', category: 'Smoothies', retailPrice: 8.49, wholesalePrice: 5.52, image: '🍍', minOrder: 12 },
  { id: 'prod-7', name: 'Protein Power Shake', category: 'Protein', retailPrice: 10.99, wholesalePrice: 7.14, image: '💪', minOrder: 12 },
  { id: 'prod-8', name: 'Berry Blast Smoothie', category: 'Smoothies', retailPrice: 8.49, wholesalePrice: 5.52, image: '🍇', minOrder: 12 },
];

export default function NewOrder() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [discount, setDiscount] = useState(35);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartnerName(data.businessName);
    setDiscount(data.discount || 35);
  }, [router]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.minOrder }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.minOrder }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty >= item.minOrder ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity >= item.minOrder)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.wholesalePrice * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      router.push('/partner/orders');
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <PartnerLayout title="Order Placed" partnerName={partnerName}>
        <div style={styles.successPage}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>
              <CheckCircle size={64} color={NEON_GREEN} />
            </div>
            <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
            <p style={styles.successText}>
              Your order has been submitted and is being processed.
              You will receive a confirmation email shortly.
            </p>
            <p style={styles.orderNumber}>Order #ORD-{Math.floor(Math.random() * 9000) + 1000}</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout title="New Order" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Place New Order</h1>
            <p style={styles.subtitle}>Your discount: {discount}% off retail prices</p>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.productsSection}>
            <div style={styles.filters}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <div style={styles.categoryTabs}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      ...styles.categoryTab,
                      ...(categoryFilter === cat ? styles.categoryTabActive : {}),
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.productGrid}>
              {filteredProducts.map(product => {
                const inCart = cart.find(item => item.id === product.id);
                return (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}>{product.image}</div>
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productCategory}>{product.category}</p>
                      <div style={styles.priceRow}>
                        <span style={styles.retailPrice}>${product.retailPrice.toFixed(2)}</span>
                        <span style={styles.wholesalePrice}>${product.wholesalePrice.toFixed(2)}</span>
                      </div>
                      <p style={styles.minOrder}>Min order: {product.minOrder} units</p>
                    </div>
                    {inCart ? (
                      <div style={styles.quantityControls}>
                        <button
                          onClick={() => updateQuantity(product.id, -product.minOrder)}
                          style={styles.qtyButton}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={styles.qtyValue}>{inCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, product.minOrder)}
                          style={styles.qtyButton}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(product)} style={styles.addButton}>
                        <Plus size={16} />
                        Add to Order
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.cartSection}>
            <div style={styles.cartCard}>
              <h2 style={styles.cartTitle}>
                <ShoppingCart size={20} />
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <p style={styles.emptyCart}>Your cart is empty</p>
              ) : (
                <>
                  <div style={styles.cartItems}>
                    {cart.map(item => (
                      <div key={item.id} style={styles.cartItem}>
                        <div style={styles.cartItemImage}>{item.image}</div>
                        <div style={styles.cartItemInfo}>
                          <span style={styles.cartItemName}>{item.name}</span>
                          <span style={styles.cartItemQty}>{item.quantity} units</span>
                        </div>
                        <div style={styles.cartItemRight}>
                          <span style={styles.cartItemPrice}>
                            ${(item.wholesalePrice * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={styles.removeButton}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.cartTotals}>
                    <div style={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={styles.totalRow}>
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p style={styles.freeShippingNote}>Free shipping on orders over $500</p>
                    )}
                    <div style={styles.grandTotalRow}>
                      <span>Total</span>
                      <span style={styles.grandTotal}>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowCheckout(true)} style={styles.checkoutButton}>
                    <CreditCard size={18} />
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {showCheckout && (
          <div style={styles.modalOverlay} onClick={() => setShowCheckout(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Confirm Order</h2>
                <button onClick={() => setShowCheckout(false)} style={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>

              <div style={styles.modalContent}>
                <div style={styles.checkoutSection}>
                  <h3 style={styles.checkoutLabel}>Shipping Address</h3>
                  <p style={styles.checkoutValue}>
                    {partnerName}<br />
                    123 Business Street<br />
                    New York, NY 10001
                  </p>
                </div>

                <div style={styles.checkoutSection}>
                  <h3 style={styles.checkoutLabel}>Payment Method</h3>
                  <p style={styles.checkoutValue}>Net 30 - Invoice</p>
                </div>

                <div style={styles.checkoutSection}>
                  <h3 style={styles.checkoutLabel}>Order Summary</h3>
                  <div style={styles.checkoutItems}>
                    {cart.map(item => (
                      <div key={item.id} style={styles.checkoutItem}>
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.wholesalePrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.checkoutTotal}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button onClick={() => setShowCheckout(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handlePlaceOrder} style={styles.placeOrderButton}>
                  <Truck size={18} />
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: NEON_GREEN,
    marginTop: 4,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24,
  },
  productsSection: {},
  filters: {
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 12,
    outline: 'none',
  },
  categoryTabs: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryTab: {
    padding: '8px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 20,
    color: '#999999',
    fontSize: 13,
    cursor: 'pointer',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: 'rgba(0, 255, 133, 0.3)',
    color: NEON_GREEN,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
  },
  productCard: {
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  productImage: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 12,
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 4px 0',
  },
  productCategory: {
    fontSize: 12,
    color: '#666666',
    margin: '0 0 8px 0',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  retailPrice: {
    fontSize: 13,
    color: '#666666',
    textDecoration: 'line-through',
  },
  wholesalePrice: {
    fontSize: 16,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  minOrder: {
    fontSize: 11,
    color: '#666666',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  qtyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 6,
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
  },
  cartSection: {
    position: 'sticky',
    top: 96,
    height: 'fit-content',
  },
  cartCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  cartTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 20px 0',
  },
  emptyCart: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    padding: '40px 0',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  cartItemImage: {
    fontSize: 24,
  },
  cartItemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cartItemName: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  cartItemQty: {
    fontSize: 12,
    color: '#666666',
  },
  cartItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
  },
  cartTotals: {
    borderTop: `1px solid ${CARD_BORDER}`,
    paddingTop: 16,
    marginBottom: 16,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  freeShippingNote: {
    fontSize: 11,
    color: NEON_GREEN,
    margin: '4px 0 12px 0',
  },
  grandTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    paddingTop: 12,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  grandTotal: {
    color: NEON_GREEN,
  },
  checkoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  successPage: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successCard: {
    textAlign: 'center',
    padding: 48,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 600,
    color: NEON_GREEN,
    marginTop: 20,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
  },
  modalContent: {
    padding: 24,
  },
  checkoutSection: {
    marginBottom: 20,
  },
  checkoutLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#666666',
    textTransform: 'uppercase',
    margin: '0 0 8px 0',
  },
  checkoutValue: {
    fontSize: 14,
    color: '#FFFFFF',
    margin: 0,
    lineHeight: 1.5,
  },
  checkoutItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  checkoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#CCCCCC',
  },
  checkoutTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    paddingTop: 12,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  modalFooter: {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    cursor: 'pointer',
  },
  placeOrderButton: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
