import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SupplyChainTransparency() {
  return (
    <div style={{ background: '#ffffff' }}>
      <Navbar />
      
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        {/* Hero Section */}
        <div style={{
          marginBottom: '60px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            fontFamily: "'DM Sans', sans-serif",
            color: '#000',
          }}>
            Supply Chain Transparency
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#999',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            California Transparency in Supply Chains Act Disclosure
          </p>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.8',
          color: '#333',
        }}>
          {/* Intro */}
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            color: '#666',
          }}>
            This disclosure is made pursuant to the California Transparency in Supply Chains Act of 2010 and is published on behalf of Drizzl Wellness, owned by Plantonica Inc..
          </p>

          {/* Commitment Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              Our Commitment
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#666',
            }}>
              Plantonica Inc. and Drizzl Wellness are committed to conducting business with the highest standards of legal compliance, ethical integrity, and respect for human rights. We categorically prohibit forced labor, child labor, human trafficking, and all forms of modern slavery within our operations and supply chain.
            </p>
          </div>

          {/* Supplier Verification Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              Supplier Verification
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#666',
            }}>
              We verify our supply chain by partnering with established, reputable suppliers that comply with applicable laws and regulations. All suppliers are required to contractually comply with our Supplier Code of Conduct, which sets standards for labor practices, workplace safety, and ethical conduct.
            </p>
          </div>

          {/* Audits Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              Audits & Compliance
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#666',
            }}>
              We reserve the right to conduct audits and on-site inspections of supplier facilities, directly or through third parties. If a violation is identified, we require corrective action and may terminate the relationship for non-compliance.
            </p>
          </div>

          {/* Training & Improvement Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              Training & Continuous Improvement
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#666',
            }}>
              Employees involved in sourcing and manufacturing are trained on ethical sourcing and compliance with our Code of Ethics and Business Conduct. We continuously assess and improve our risk management and compliance programs to strengthen supply chain integrity.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
