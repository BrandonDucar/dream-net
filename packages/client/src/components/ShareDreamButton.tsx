import { useState } from 'react';

interface ShareDreamButtonProps {
  dreamCore: any;
}

export default function ShareDreamButton({ dreamCore }: ShareDreamButtonProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/generate-dream-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamCore })
      });

      const data = await response.json();
      if (data.status === 'success') {
        const link = `${window.location.origin}/dreams/${data.slug}`;
        setShareUrl(link);
      }
    } catch (error) {
      console.error('Share generation failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div style={{ padding: 16, background: '#111', border: '1px solid #0ff', borderRadius: 8, marginTop: 16 }}>
      <h4 style={{ color: '#0ff', marginBottom: 12 }}>🌐 Share Dream Core</h4>
      
      {!shareUrl ? (
        <button 
          onClick={generateShareLink} 
          disabled={isSharing}
          style={{
            background: isSharing ? '#333' : '#0ff',
            color: isSharing ? '#666' : '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: isSharing ? 'not-allowed' : 'pointer'
          }}
        >
          {isSharing ? '🔄 Generating...' : '🔗 Generate Share Link'}
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: 8, color: '#0ff', fontSize: 14 }}>
            Share Link Generated:
          </div>
          <div style={{ 
            background: '#000', 
            padding: 8, 
            borderRadius: 4, 
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: 12,
            wordBreak: 'break-all',
            marginBottom: 8
          }}>
            {shareUrl}
          </div>
          <button 
            onClick={copyToClipboard}
            style={{
              background: copied ? '#0f0' : '#0ff',
              color: '#000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}