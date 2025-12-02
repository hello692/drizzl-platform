import Navbar from '../components/Navbar';

export default function Juices() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>JUICES</h1>
        <p style={{ fontSize: '16px', color: '#666', fontFamily: "'JetBrains Mono', monospace" }}>Cold pressed juices coming soon.</p>
      </div>
    </div>
  );
}
