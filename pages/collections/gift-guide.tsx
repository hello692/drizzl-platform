import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const gifts = [
  {
    id: 'gift1',
    name: 'The Starter Box',
    price: 59.99,
    desc: 'Perfect for getting started with Drizzl. Includes 12 assorted smoothies & bowls.',
    tag: 'Popular',
  },
  {
    id: 'gift2',
    name: 'The Protein Box',
    price: 69.99,
    desc: 'For the fitness enthusiast. 12 high-protein smoothies to fuel their goals.',
    tag: '',
  },
  {
    id: 'gift3',
    name: 'The Wellness Box',
    price: 79.99,
    desc: 'A complete wellness experience. Mix of smoothies, bowls, and protein powders.',
    tag: 'Best Seller',
  },
  {
    id: 'gift4',
    name: 'The Ultimate Box',
    price: 89.99,
    desc: 'Everything they need. 14 smoothies, 8 breakfast bowls, and 4 bites.',
    tag: 'Premium',
  },
];

export default function GiftGuide() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Banner Section */}
          <div style={{
            background: '#f9f9f9',
            borderRadius: '4px',
            padding: '60px 40px',
            marginBottom: '60px',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: '24px', fontSize: '48px' }}>🎁</div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>Gift Guide</h1>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 32px' }}>
              Give the gift of health and wellness. Beautifully packaged, ready to delight.
            </p>
            <div style={{
              background: '#fff',
              padding: '12px 20px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '14px',
              color: '#666',
            }}>
              Built on organic • Healthy gifts • Loved by 2M+ customers
            </div>
          </div>

          {/* Gift Boxes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '60px',
          }}>
            {gifts.map(gift => (
              <div key={gift.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  background: '#f9f9f9',
                  height: '240px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                }}>
                  {gift.tag && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: gift.tag === 'Best Seller' ? '#000' : '#373f47',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}>
                      {gift.tag}
                    </span>
                  )}
                  🎁
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    {gift.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                    {gift.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700' }}>${gift.price.toFixed(2)}</span>
                    <button style={{
                      padding: '10px 20px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Section */}
          <div style={{
            background: '#f9f9f9',
            borderRadius: '4px',
            padding: '60px 40px',
            textAlign: 'center',
            marginBottom: '60px',
          }}>
            <div style={{ marginBottom: '24px', fontSize: '24px' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
              "The perfect gift for someone who cares about their health. They loved it!"
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>— Sarah M., Verified Buyer</p>
          </div>

          {/* FAQ Section */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '40px', textAlign: 'center' }}>
              Gift Questions?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  Can I customize a gift box?
                </h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Yes! Contact our team for custom gift packages tailored to any preference.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  How is the gift packaged?
                </h3>
                <p style={{ color: '#666', margin: 0 }}>
                  All gifts come beautifully packaged in our signature eco-friendly boxes, ready to impress.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  Can I include a gift message?
                </h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Absolutely! Add a personalized message at checkout. It will be included with the gift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
