import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';

interface FormData {
  legalBusinessName: string;
  dbaStoreName: string;
  businessAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  einTaxId: string;
  resaleCertificateUrl: string;
  businessType: string;
  yearsInBusiness: string;
  decisionMakerName: string;
  decisionMakerRole: string;
  decisionMakerEmail: string;
  decisionMakerPhone: string;
  estimatedMonthlyVolume: string;
  preferredDeliverySchedule: string;
  receivingHours: string;
  hasLoadingDock: string;
  preferredPaymentMethod: string;
}

const initialFormData: FormData = {
  legalBusinessName: '',
  dbaStoreName: '',
  businessAddress: '',
  city: '',
  state: '',
  zip: '',
  country: 'USA',
  businessPhone: '',
  businessEmail: '',
  website: '',
  einTaxId: '',
  resaleCertificateUrl: '',
  businessType: '',
  yearsInBusiness: '',
  decisionMakerName: '',
  decisionMakerRole: '',
  decisionMakerEmail: '',
  decisionMakerPhone: '',
  estimatedMonthlyVolume: '',
  preferredDeliverySchedule: '',
  receivingHours: '',
  hasLoadingDock: '',
  preferredPaymentMethod: '',
};

export default function RetailApply() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [existingApplication, setExistingApplication] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkExistingApplication();
      setFormData(prev => ({
        ...prev,
        businessEmail: user.email || '',
        decisionMakerEmail: user.email || '',
      }));
    }
  }, [user]);

  async function checkExistingApplication() {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/retail/status?userId=${user.id}`);
      const data = await response.json();
      
      if (data.hasApplication) {
        setExistingApplication(data);
      }
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (stepNum: number): boolean => {
    setError('');
    
    if (stepNum === 1) {
      if (!formData.legalBusinessName || !formData.businessAddress || !formData.city || 
          !formData.state || !formData.zip || !formData.businessPhone || !formData.businessEmail) {
        setError('Please fill in all required fields.');
        return false;
      }
    }
    
    if (stepNum === 2) {
      if (!formData.einTaxId || !formData.businessType) {
        setError('Please provide your EIN/Tax ID and business type.');
        return false;
      }
    }
    
    if (stepNum === 3) {
      if (!formData.decisionMakerName || !formData.decisionMakerEmail) {
        setError('Please provide decision maker information.');
        return false;
      }
    }
    
    if (stepNum === 4) {
      if (!formData.estimatedMonthlyVolume || !formData.preferredDeliverySchedule || !formData.preferredPaymentMethod) {
        setError('Please complete all order preferences.');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || !user) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/retail/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          applicationData: formData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }
      
      router.push('/retail/application-submitted');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', padding: '80px 40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Sign In Required</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>Please sign in or create an account to apply as a wholesale partner.</p>
          <Link href="/auth" style={{ padding: '14px 32px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
            Sign In / Create Account
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (existingApplication) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', padding: '80px 40px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: existingApplication.status === 'approved' ? '#e6f4ea' : existingApplication.status === 'rejected' ? '#fce8e6' : '#fff3e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
            }}>
              {existingApplication.status === 'approved' ? '✓' : existingApplication.status === 'rejected' ? '×' : '○'}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
              Application {existingApplication.status === 'approved' ? 'Approved' : existingApplication.status === 'rejected' ? 'Not Approved' : 'Under Review'}
            </h1>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
              {existingApplication.status === 'approved' 
                ? 'Congratulations! Your wholesale partner application has been approved. You now have access to wholesale pricing and ordering.'
                : existingApplication.status === 'rejected'
                ? `Your application was not approved. ${existingApplication.rejectionReason || 'Please contact our team for more information.'}`
                : 'Your wholesale partner application is currently being reviewed. We typically process applications within 1-2 business days.'}
            </p>
            {existingApplication.status === 'approved' ? (
              <Link href="/retail-partner/dashboard" style={{ padding: '14px 32px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                Go to Wholesale Dashboard
              </Link>
            ) : (
              <Link href="/" style={{ padding: '14px 32px', background: '#f5f5f5', color: '#000', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                Return to Homepage
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#000',
  };

  const stepTitles = ['Business Information', 'Business Verification', 'Decision Maker', 'Order & Logistics'];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', padding: '60px 20px', background: '#fafafa' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Wholesale Partner Application</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Complete all steps to apply for wholesale pricing and ordering</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: s === step ? '#000' : s < step ? '#1e7e34' : '#e0e0e0',
                  color: s <= step ? '#fff' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {s < step ? '✓' : s}
                </div>
                {s < 4 && <div style={{ width: '40px', height: '2px', background: s < step ? '#1e7e34' : '#e0e0e0' }} />}
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Step {step}: {stepTitles[step - 1]}</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>
              {step === 1 && 'Tell us about your business'}
              {step === 2 && 'Verify your business credentials'}
              {step === 3 && 'Who will be the main contact?'}
              {step === 4 && 'Help us understand your ordering needs'}
            </p>

            {error && (
              <div style={{ padding: '12px 16px', background: '#fce8e6', borderRadius: '8px', marginBottom: '24px', color: '#c53929', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Legal Business Name *</label>
                  <input type="text" name="legalBusinessName" value={formData.legalBusinessName} onChange={handleChange} style={inputStyle} placeholder="Your registered business name" />
                </div>
                <div>
                  <label style={labelStyle}>DBA / Store Name</label>
                  <input type="text" name="dbaStoreName" value={formData.dbaStoreName} onChange={handleChange} style={inputStyle} placeholder="If different from legal name" />
                </div>
                <div>
                  <label style={labelStyle}>Business Address *</label>
                  <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} style={inputStyle} placeholder="Street address" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>ZIP *</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} style={inputStyle}>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Business Phone *</label>
                    <input type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleChange} style={inputStyle} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label style={labelStyle}>Business Email *</label>
                    <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Website or Instagram (optional)</label>
                  <input type="text" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https:// or @handle" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>EIN / Tax ID *</label>
                  <input type="text" name="einTaxId" value={formData.einTaxId} onChange={handleChange} style={inputStyle} placeholder="XX-XXXXXXX" />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>Your information is stored securely and encrypted</p>
                </div>
                <div>
                  <label style={labelStyle}>Resale Certificate (optional)</label>
                  <input type="text" name="resaleCertificateUrl" value={formData.resaleCertificateUrl} onChange={handleChange} style={inputStyle} placeholder="Paste a link to your document (Google Drive, Dropbox, etc.)" />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>Upload your resale certificate to a cloud service and paste the link here</p>
                </div>
                <div>
                  <label style={labelStyle}>Business Type *</label>
                  <select name="businessType" value={formData.businessType} onChange={handleChange} style={inputStyle}>
                    <option value="">Select your business type</option>
                    <option value="retail_store">Retail Store</option>
                    <option value="cafe">Cafe / Coffee Shop</option>
                    <option value="gym">Gym / Fitness Center</option>
                    <option value="hotel">Hotel / Hospitality</option>
                    <option value="distributor">Distributor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Years in Business</label>
                  <input type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} style={inputStyle} placeholder="e.g., 5" min="0" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" name="decisionMakerName" value={formData.decisionMakerName} onChange={handleChange} style={inputStyle} placeholder="First and last name" />
                </div>
                <div>
                  <label style={labelStyle}>Role / Title *</label>
                  <select name="decisionMakerRole" value={formData.decisionMakerRole} onChange={handleChange} style={inputStyle}>
                    <option value="">Select your role</option>
                    <option value="owner">Owner</option>
                    <option value="buyer">Buyer / Purchasing Manager</option>
                    <option value="manager">General Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Direct Email *</label>
                  <input type="email" name="decisionMakerEmail" value={formData.decisionMakerEmail} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Direct Phone</label>
                  <input type="tel" name="decisionMakerPhone" value={formData.decisionMakerPhone} onChange={handleChange} style={inputStyle} placeholder="(555) 123-4567" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Estimated Monthly Order Volume *</label>
                  <select name="estimatedMonthlyVolume" value={formData.estimatedMonthlyVolume} onChange={handleChange} style={inputStyle}>
                    <option value="">Select estimated volume</option>
                    <option value="under_500">Under $500</option>
                    <option value="500_2000">$500 - $2,000</option>
                    <option value="2000_5000">$2,000 - $5,000</option>
                    <option value="5000_10000">$5,000 - $10,000</option>
                    <option value="over_10000">Over $10,000</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Delivery Schedule *</label>
                  <select name="preferredDeliverySchedule" value={formData.preferredDeliverySchedule} onChange={handleChange} style={inputStyle}>
                    <option value="">Select delivery frequency</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi_weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Receiving Hours</label>
                  <input type="text" name="receivingHours" value={formData.receivingHours} onChange={handleChange} style={inputStyle} placeholder="e.g., Mon-Fri 8am-5pm" />
                </div>
                <div>
                  <label style={labelStyle}>Loading Dock Available? *</label>
                  <select name="hasLoadingDock" value={formData.hasLoadingDock} onChange={handleChange} style={inputStyle}>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Payment Method *</label>
                  <select name="preferredPaymentMethod" value={formData.preferredPaymentMethod} onChange={handleChange} style={inputStyle}>
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="ach">ACH / Bank Transfer</option>
                    <option value="net_30">Net-30</option>
                    <option value="net_60">Net-60</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '12px' }}>
              {step > 1 ? (
                <button onClick={prevStep} style={{ padding: '14px 28px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Back
                </button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <button onClick={nextStep} style={{ padding: '14px 40px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Continue
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '14px 40px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: isSubmitting ? 'default' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#666' }}>
            Questions? Contact <a href="mailto:wholesale@drizzlwellness.com" style={{ color: '#000', fontWeight: '600' }}>wholesale@drizzlwellness.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
