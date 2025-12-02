import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Blog() {
  const posts = [
    {
      title: '5 Reasons to Start Your Day with a Smoothie',
      excerpt: 'Discover the health benefits of incorporating smoothies into your morning routine.',
      date: '2024-01-15',
    },
    {
      title: 'Organic Ingredients: Why They Matter',
      excerpt: 'Learn about the importance of choosing organic foods for your health and the environment.',
      date: '2024-01-10',
    },
    {
      title: 'Quick Breakfast Bowl Recipes',
      excerpt: 'Explore delicious and easy recipes for healthy breakfast bowls.',
      date: '2024-01-05',
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px' }}>Blog & Recipes</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {posts.map((post, idx) => (
              <div key={idx} style={{
                border: '1px solid #e8e8e8',
                padding: '24px',
                borderRadius: '4px',
              }}>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{post.title}</h3>
                <p style={{ margin: 0, color: '#666' }}>{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
