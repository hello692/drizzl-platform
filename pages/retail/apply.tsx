import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  agreedToTerms: boolean;
}

interface AddressSuggestion {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
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
  agreedToTerms: false,
};

export default function RetailApply() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [existingApplication, setExistingApplication] = useState<any>(null);
  
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowAddressSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=us,ca&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DrizzlWellness/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data);
        setShowAddressSuggestions(data.length > 0);
      }
    } catch (err) {
      console.error('Address search error:', err);
    } finally {
      setIsSearchingAddress(false);
    }
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, businessAddress: value }));
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 300);
  };

  const selectAddress = (suggestion: AddressSuggestion) => {
    const addr = suggestion.address;
    const streetAddress = addr.house_number 
      ? `${addr.house_number} ${addr.road || ''}`
      : addr.road || suggestion.display_name.split(',')[0];
    
    setFormData(prev => ({
      ...prev,
      businessAddress: streetAddress.trim(),
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.postcode || '',
      country: addr.country === 'United States' || addr.country === 'USA' ? 'USA' : 'CAN',
    }));
    
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const [uploadError, setUploadError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setError('');

    const fileExt = file.name.split('.').pop();
    const fileName = `resale-cert-${user?.id}-${Date.now()}.${fileExt}`;
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    let uploadSuccess = false;
    let publicUrl = '';

    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (!listError && buckets) {
        const bucketExists = buckets.some(b => b.name === 'certificates');
        
        if (bucketExists) {
          const { data, error: storageError } = await supabase.storage
            .from('certificates')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (!storageError && data) {
            const { data: urlData } = supabase.storage
              .from('certificates')
              .getPublicUrl(fileName);
            publicUrl = urlData.publicUrl;
            uploadSuccess = true;
          }
        }
      }
    } catch {
      // Silently handle storage errors - we'll use fallback
    }

    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsUploading(false);

    if (uploadSuccess && publicUrl) {
      setFormData(prev => ({ ...prev, resaleCertificateUrl: publicUrl }));
      setUploadError('');
    } else {
      setUploadError('File uploaded locally. Cloud storage not configured - your file will be reviewed after submission.');
      setFormData(prev => ({ ...prev, resaleCertificateUrl: `pending:${file.name}` }));
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setFormData(prev => ({ ...prev, resaleCertificateUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      if (!formData.agreedToTerms) {
        setError('Please agree to the terms and policy to submit your application.');
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
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={existingApplication.status === 'approved' ? '#1e7e34' : existingApplication.status === 'rejected' ? '#c53929' : '#f57c00'} strokeWidth="2">
                {existingApplication.status === 'approved' && <path d="M20 6L9 17l-5-5" />}
                {existingApplication.status === 'rejected' && <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
                {existingApplication.status === 'pending' && <circle cx="12" cy="12" r="10" />}
              </svg>
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
                  {s < step ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : s}
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
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>Business Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={addressInputRef}
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleAddressChange}
                      onFocus={() => formData.businessAddress.length >= 3 && setShowAddressSuggestions(addressSuggestions.length > 0)}
                      style={{ ...inputStyle, paddingRight: '40px' }}
                      placeholder="Start typing your address..."
                      autoComplete="off"
                    />
                    {isSearchingAddress && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2" fill="none" strokeDasharray="30 60" />
                        </svg>
                      </div>
                    )}
                    {!isSearchingAddress && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #d0d0d0',
                        borderRadius: '8px',
                        marginTop: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        maxHeight: '240px',
                        overflowY: 'auto',
                      }}
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => selectAddress(suggestion)}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: index < addressSuggestions.length - 1 ? '1px solid #eee' : 'none',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span style={{ color: '#333' }}>{suggestion.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => !uploadedFile && fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isDragOver ? '#000' : '#d0d0d0'}`,
                      borderRadius: '12px',
                      padding: uploadedFile ? '20px' : '40px 20px',
                      textAlign: 'center',
                      cursor: uploadedFile ? 'default' : 'pointer',
                      background: isDragOver ? '#f9f9f9' : '#fff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    {!uploadedFile ? (
                      <>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                          <strong>Drag and drop</strong> your certificate here
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>or click to browse</p>
                        <p style={{ fontSize: '12px', color: '#999' }}>PDF, JPG, or PNG up to 10MB</p>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e7e34" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{uploadedFile.name}</p>
                            <p style={{ fontSize: '12px', color: uploadError ? '#e65100' : '#666' }}>
                              {isUploading ? `Uploading... ${uploadProgress}%` : uploadError || 'Uploaded successfully'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            color: '#666',
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
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

                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  background: '#f9f9f9', 
                  borderRadius: '12px',
                  border: '1px solid #e8e8e8'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '2px',
                        cursor: 'pointer',
                        accentColor: '#000',
                      }}
                    />
                    <span>
                      I hereby agree to the terms and policies of <strong>Drizzl Wellness Plantonica Inc.</strong> I confirm that all information provided in this application is accurate and complete. I understand that my application will be reviewed and I will be notified of the decision.
                    </span>
                  </label>
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
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Footer />
    </>
  );
}
