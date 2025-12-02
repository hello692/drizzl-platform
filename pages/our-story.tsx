import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OurStory() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px' }}>Our Story</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.8' }}>
            <p>
              Drizzl Wellness was founded with a simple mission: to make healthy eating convenient and delicious.
              We believe that everyone deserves access to clean, nutritious food without the hassle of meal prep.
            </p>

            <p>
              Our frozen smoothies and bowls are crafted from organic fruits, vegetables, and superfoods.
              Each blend is carefully designed to provide maximum nutrition and taste in every serving.
            </p>

            <p>
              We're committed to sustainability, quality, and customer satisfaction. Every product that leaves
              our facility is made with care and dedication to your wellness.
            </p>

            <p>
              Join thousands of customers who have made Drizzl part of their daily routine. Together, we're
              building a healthier, happier community.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
