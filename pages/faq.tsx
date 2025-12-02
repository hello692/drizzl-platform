import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FAQ() {
  const faqs = [
    {
      q: 'How do I use the smoothies?',
      a: 'Simply blend with water, milk, or your favorite liquid for 30-45 seconds. Add ice for a colder smoothie.',
    },
    {
      q: 'Are the smoothies organic?',
      a: 'Yes, all our smoothies are made with organic ingredients sourced from trusted suppliers.',
    },
    {
      q: 'How long do they stay fresh?',
      a: 'Our frozen smoothies stay fresh in your freezer for up to 12 months from the date of shipment.',
    },
    {
      q: 'Do you offer subscriptions?',
      a: 'Yes! Sign up for a subscription to get 10% off and automatic deliveries.',
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Frequently Asked Questions</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{faq.q}</h3>
                <p style={{ margin: 0, lineHeight: '1.7' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
