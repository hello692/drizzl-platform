import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Building2, 
  User, 
  FileText, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader,
  Upload,
  X,
  Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NEON_GREEN = '#00FF85';

const BUSINESS_TYPES = [
  'Restaurant',
  'Cafe',
  'Gym',
  'Juice Bar',
  'Grocery',
  'Other'
];

const STEPS = [
  { id: 1, title: 'Business Information', icon: Building2 },
  { id: 2, title: 'Contact Details', icon: User },
  { id: 3, title: 'Business Documents', icon: FileText },
  { id: 4, title: 'Trade References', icon: Users },
  { id: 5, title: 'Review & Submit', icon: CheckCircle },
];

interface FormData {
  businessName: string;
  businessType: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  taxId: string;
  businessLicense: File | null;
  reference1Company: string;
  reference1Contact: string;
  reference1Phone: string;
  reference2Company: string;
  reference2Contact: string;
  reference2Phone: string;
  reference3Company: string;
  reference3Contact: string;
  reference3Phone: string;
  agreeToTerms: boolean;
}

const initialFormData: FormData = {
  businessName: '',
  businessType: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  contactName: '',
  email: '',
  phone: '',
  taxId: '',
  businessLicense: null,
  reference1Company: '',
  reference1Contact: '',
  reference1Phone: '',
  reference2Company: '',
  reference2Contact: '',
  reference2Phone: '',
  reference3Company: '',
  reference3Contact: '',
  reference3Phone: '',
  agreeToTerms: false,
};

export default function PartnerApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          setError('Business name is required');
          return false;
        }
        if (!formData.businessType) {
          setError('Please select a business type');
          return false;
        }
        return true;
      case 2:
        if (!formData.contactName.trim()) {
          setError('Contact name is required');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.reference1Company.trim() || !formData.reference1Contact.trim()) {
          setError('At least 2 trade references are required');
          return false;
        }
        if (!formData.reference2Company.trim() || !formData.reference2Contact.trim()) {
          setError('At least 2 trade references are required');
          return false;
        }
        return true;
      case 5:
        if (!formData.agreeToTerms) {
          setError('You must agree to the terms and conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      updateFormData('businessLicense', e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData('businessLicense', e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setLoading(true);
    setError('');

    try {
      const applicationData = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        contact_name: formData.contactName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        tax_id: formData.taxId || null,
        status: 'pending',
        references: JSON.stringify([
          {
            company: formData.reference1Company,
            contact: formData.reference1Contact,
            phone: formData.reference1Phone,
          },
          {
            company: formData.reference2Company,
            contact: formData.reference2Contact,
            phone: formData.reference2Phone,
          },
          formData.reference3Company ? {
            company: formData.reference3Company,
            contact: formData.reference3Contact,
            phone: formData.reference3Phone,
          } : null,
        ].filter(Boolean)),
      };

      const { error: insertError } = await supabase
        .from('partner_applications')
        .insert(applicationData);

      if (insertError) {
        console.error('Application submission error:', insertError);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Application Submitted | DRIZZL Partner Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>
              <CheckCircle size={64} color={NEON_GREEN} />
            </div>
            <h1 style={styles.successTitle}>Application Received!</h1>
            <p style={styles.successText}>
              Thank you for applying to become a DRIZZL partner. Our team will review your 
              application and contact you within 48 hours.
            </p>
            <div style={styles.successDetails}>
              <div style={styles.successDetail}>
                <strong>Business:</strong> {formData.businessName}
              </div>
              <div style={styles.successDetail}>
                <strong>Contact:</strong> {formData.contactName}
              </div>
              <div style={styles.successDetail}>
                <strong>Email:</strong> {formData.email}
              </div>
            </div>
            <Link href="/partner/login" style={styles.loginButton}>
              Go to Partner Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Become a Partner | DRIZZL</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <img
              src="/logo.gif"
              alt="DRIZZL"
              style={styles.logo}
            />
            <h1 style={styles.title}>Partner Application</h1>
            <p style={styles.subtitle}>Join our wholesale network</p>
          </div>

          <div style={styles.progressContainer}>
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div style={styles.stepItem}>
                    <div style={{
                      ...styles.stepCircle,
                      backgroundColor: isCompleted ? NEON_GREEN : isActive ? 'rgba(0, 255, 133, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isActive || isCompleted ? NEON_GREEN : 'rgba(255, 255, 255, 0.1)',
                    }}>
                      {isCompleted ? (
                        <Check size={16} color="#000000" />
                      ) : (
                        <Icon size={16} color={isActive ? NEON_GREEN : '#666666'} />
                      )}
                    </div>
                    <span style={{
                      ...styles.stepLabel,
                      color: isActive || isCompleted ? '#FFFFFF' : '#666666',
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div style={{
                      ...styles.stepLine,
                      backgroundColor: isCompleted ? NEON_GREEN : 'rgba(255, 255, 255, 0.1)',
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div style={styles.formContainer}>
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {currentStep === 1 && (
              <div style={styles.stepContent}>
                <h2 style={styles.stepTitle}>Business Information</h2>
                <p style={styles.stepDescription}>Tell us about your business</p>

                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Business Name *</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                      placeholder="Your business name"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Business Type *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => updateFormData('businessType', e.target.value)}
                      style={styles.select}
                      required
                    >
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Street Address</label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => updateFormData('streetAddress', e.target.value)}
                      placeholder="123 Main Street"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="City"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      placeholder="State"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => updateFormData('zip', e.target.value)}
                      placeholder="12345"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      placeholder="Country"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={styles.stepContent}>
                <h2 style={styles.stepTitle}>Contact Details</h2>
                <p style={styles.stepDescription}>Who should we contact about this application?</p>

                <div style={styles.formGrid}>
                  <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Primary Contact Name *</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => updateFormData('contactName', e.target.value)}
                      placeholder="Full name"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="email@company.com"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={styles.stepContent}>
                <h2 style={styles.stepTitle}>Business Documents</h2>
                <p style={styles.stepDescription}>Optional documentation to expedite your application</p>

                <div style={styles.formGrid}>
                  <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Tax ID / EIN (Optional)</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateFormData('taxId', e.target.value)}
                      placeholder="XX-XXXXXXX"
                      style={styles.input}
                    />
                  </div>

                  <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Business License (Optional)</label>
                    <div
                      style={{
                        ...styles.dropZone,
                        borderColor: dragActive ? NEON_GREEN : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: dragActive ? 'rgba(0, 255, 133, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {formData.businessLicense ? (
                        <div style={styles.filePreview}>
                          <FileText size={24} color={NEON_GREEN} />
                          <span style={styles.fileName}>{formData.businessLicense.name}</span>
                          <button
                            type="button"
                            onClick={() => updateFormData('businessLicense', null)}
                            style={styles.removeFile}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} color="#666666" />
                          <p style={styles.dropText}>
                            Drag and drop your file here, or{' '}
                            <label style={styles.browseLabel}>
                              browse
                              <input
                                type="file"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                          </p>
                          <span style={styles.dropHint}>PDF, JPG, or PNG up to 10MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={styles.stepContent}>
                <h2 style={styles.stepTitle}>Trade References</h2>
                <p style={styles.stepDescription}>Provide at least 2 business references</p>

                <div style={styles.referenceSection}>
                  <h3 style={styles.referenceTitle}>Reference 1 *</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Company Name</label>
                      <input
                        type="text"
                        value={formData.reference1Company}
                        onChange={(e) => updateFormData('reference1Company', e.target.value)}
                        placeholder="Company name"
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Contact Person</label>
                      <input
                        type="text"
                        value={formData.reference1Contact}
                        onChange={(e) => updateFormData('reference1Contact', e.target.value)}
                        placeholder="Contact name"
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                      <label style={styles.label}>Phone / Email</label>
                      <input
                        type="text"
                        value={formData.reference1Phone}
                        onChange={(e) => updateFormData('reference1Phone', e.target.value)}
                        placeholder="Phone or email"
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.referenceSection}>
                  <h3 style={styles.referenceTitle}>Reference 2 *</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Company Name</label>
                      <input
                        type="text"
                        value={formData.reference2Company}
                        onChange={(e) => updateFormData('reference2Company', e.target.value)}
                        placeholder="Company name"
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Contact Person</label>
                      <input
                        type="text"
                        value={formData.reference2Contact}
                        onChange={(e) => updateFormData('reference2Contact', e.target.value)}
                        placeholder="Contact name"
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                      <label style={styles.label}>Phone / Email</label>
                      <input
                        type="text"
                        value={formData.reference2Phone}
                        onChange={(e) => updateFormData('reference2Phone', e.target.value)}
                        placeholder="Phone or email"
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.referenceSection}>
                  <h3 style={styles.referenceTitle}>Reference 3 (Optional)</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Company Name</label>
                      <input
                        type="text"
                        value={formData.reference3Company}
                        onChange={(e) => updateFormData('reference3Company', e.target.value)}
                        placeholder="Company name"
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Contact Person</label>
                      <input
                        type="text"
                        value={formData.reference3Contact}
                        onChange={(e) => updateFormData('reference3Contact', e.target.value)}
                        placeholder="Contact name"
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                      <label style={styles.label}>Phone / Email</label>
                      <input
                        type="text"
                        value={formData.reference3Phone}
                        onChange={(e) => updateFormData('reference3Phone', e.target.value)}
                        placeholder="Phone or email"
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div style={styles.stepContent}>
                <h2 style={styles.stepTitle}>Review & Submit</h2>
                <p style={styles.stepDescription}>Please review your application details</p>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Business Information</h3>
                  <div style={styles.reviewGrid}>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Business Name</span>
                      <span style={styles.reviewValue}>{formData.businessName}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Business Type</span>
                      <span style={styles.reviewValue}>{formData.businessType}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Address</span>
                      <span style={styles.reviewValue}>
                        {[formData.streetAddress, formData.city, formData.state, formData.zip, formData.country]
                          .filter(Boolean)
                          .join(', ') || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Contact Details</h3>
                  <div style={styles.reviewGrid}>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Contact Name</span>
                      <span style={styles.reviewValue}>{formData.contactName}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Email</span>
                      <span style={styles.reviewValue}>{formData.email}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Phone</span>
                      <span style={styles.reviewValue}>{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Business Documents</h3>
                  <div style={styles.reviewGrid}>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Tax ID / EIN</span>
                      <span style={styles.reviewValue}>{formData.taxId || 'Not provided'}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Business License</span>
                      <span style={styles.reviewValue}>
                        {formData.businessLicense ? formData.businessLicense.name : 'Not uploaded'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Trade References</h3>
                  <div style={styles.reviewGrid}>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Reference 1</span>
                      <span style={styles.reviewValue}>
                        {formData.reference1Company} - {formData.reference1Contact}
                      </span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Reference 2</span>
                      <span style={styles.reviewValue}>
                        {formData.reference2Company} - {formData.reference2Contact}
                      </span>
                    </div>
                    {formData.reference3Company && (
                      <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Reference 3</span>
                        <span style={styles.reviewValue}>
                          {formData.reference3Company} - {formData.reference3Contact}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <label style={styles.termsLabel}>
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.termsText}>
                    I agree to the{' '}
                    <Link href="/terms" style={styles.termsLink}>Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link href="/privacy" style={styles.termsLink}>Privacy Policy</Link>
                  </span>
                </label>
              </div>
            )}

            <div style={styles.navigation}>
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} style={styles.backButton}>
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
              
              {currentStep < 5 ? (
                <button type="button" onClick={handleNext} style={styles.nextButton}>
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.6 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div style={styles.footer}>
            Already have an account?{' '}
            <Link href="/partner/login" style={styles.loginLink}>Sign in</Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .progress-labels { display: none !important; }
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 720,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logo: {
    height: 40,
    marginBottom: 16,
    filter: 'brightness(0) invert(1)',
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
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    padding: '0 20px',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid',
    transition: 'all 0.3s',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: 80,
    transition: 'color 0.3s',
  },
  stepLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
    transition: 'background-color 0.3s',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 32,
    backdropFilter: 'blur(20px)',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 24,
  },
  stepContent: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666666',
    margin: '0 0 24px 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#CCCCCC',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  dropZone: {
    border: '2px dashed',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  dropText: {
    color: '#999999',
    fontSize: 14,
    margin: '12px 0 8px 0',
  },
  browseLabel: {
    color: NEON_GREEN,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  dropHint: {
    color: '#666666',
    fontSize: 12,
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  removeFile: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: 'none',
    borderRadius: 4,
    padding: 4,
    color: '#EF4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  reviewSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
    margin: '0 0 16px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  reviewGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  reviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  reviewLabel: {
    fontSize: 13,
    color: '#666666',
    flexShrink: 0,
  },
  reviewValue: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  termsLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    cursor: 'pointer',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    accentColor: NEON_GREEN,
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: 2,
  },
  termsText: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 1.5,
  },
  termsLink: {
    color: NEON_GREEN,
    textDecoration: 'underline',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 32px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'opacity 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 32px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666666',
    fontSize: 14,
  },
  loginLink: {
    color: NEON_GREEN,
    textDecoration: 'none',
  },
  successContainer: {
    textAlign: 'center',
    maxWidth: 480,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 48,
    backdropFilter: 'blur(20px)',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  successText: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  successDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  successDetail: {
    fontSize: 14,
    color: '#CCCCCC',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 32px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    transition: 'opacity 0.2s',
  },
};
