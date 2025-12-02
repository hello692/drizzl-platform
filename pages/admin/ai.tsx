import React, { useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

export default function AdminAI() {
  const { loading, authorized } = useRequireAdmin();
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [contentType, setContentType] = useState<'hero' | 'product' | 'email' | 'social'>('hero');

  async function generateContent() {
    setGenerating(true);
    setSuggestion('');
    
    try {
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, contentType }),
      });
      
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error generating content:', error);
      setSuggestion('Error generating content. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function useContent() {
    navigator.clipboard.writeText(suggestion);
    alert('Content copied to clipboard!');
  }

  if (loading || !authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>AI Content Helper</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Generate marketing copy with AI assistance</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Content Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['hero', 'product', 'email', 'social'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: contentType === type ? '#000' : '#fff',
                    color: contentType === type ? '#fff' : '#000',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Describe what you need</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Hero headline for summer smoothie collection promoting fresh ingredients and health benefits..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            onClick={generateContent}
            disabled={generating || !input.trim()}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: generating ? 'default' : 'pointer',
              opacity: generating || !input.trim() ? 0.6 : 1,
            }}
          >
            {generating ? 'Generating...' : 'Generate Content'}
          </button>

          {suggestion && (
            <div style={{ marginTop: '32px', padding: '24px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Generated Content</h3>
                <button
                  onClick={useContent}
                  style={{
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>
              <p style={{ fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{suggestion}</p>
            </div>
          )}

          <div style={{ marginTop: '32px', padding: '20px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3cd' }}>
            <p style={{ fontSize: '13px', color: '#856404', lineHeight: '1.6' }}>
              <strong>Note:</strong> This is currently using placeholder AI responses. To enable real AI generation, connect your OpenAI API key in the environment variables (OPENAI_API_KEY).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
