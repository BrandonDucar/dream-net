import React, { useState } from 'react';
import { validateMessage } from '../../logic/messageValidation';

interface MessageComposerProps {
  fromWallet: string;
  onMessageSent: (messageId: string) => void;
}

export default function MessageComposer({ fromWallet, onMessageSent }: MessageComposerProps) {
  const [toWallet, setToWallet] = useState('');
  const [content, setContent] = useState('');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenType, setTokenType] = useState<'FLBY' | 'SHEEP'>('FLBY');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const validateForm = () => {
    const validation = validateMessage(content, tokenAmount);
    setErrors(validation.errors);
    setWarnings(validation.warnings);
    
    // Additional wallet validation
    const formErrors = [...validation.errors];
    if (!toWallet || toWallet.trim().length === 0) {
      formErrors.push('Recipient wallet address is required');
    }
    if (!toWallet.startsWith('0x') || toWallet.length !== 42) {
      formErrors.push('Invalid wallet address format');
    }
    
    setErrors(formErrors);
    return formErrors.length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    try {
      setSending(true);
      
      const response = await fetch('/api/dreamnodes/flutterbye/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromWallet,
          toWallet: toWallet.trim(),
          content: content.trim(),
          tokenAmount,
          tokenType,
          signature: `mock_signature_${Date.now()}` // TODO: Implement actual signing
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        onMessageSent(result.message.id);
        // Reset form
        setToWallet('');
        setContent('');
        setTokenAmount(0);
        setErrors([]);
        setWarnings([]);
      } else {
        setErrors([result.error || 'Failed to send message']);
      }
    } catch (error) {
      setErrors(['Network error - please try again']);
    } finally {
      setSending(false);
    }
  };

  const characterCount = content.length;
  const maxCharacters = 2048;

  return (
    <div className="message-composer">
      <h3>✍️ Compose New Message</h3>
      
      <div className="composer-form">
        <div className="form-group">
          <label htmlFor="recipient">Recipient Wallet Address</label>
          <input
            id="recipient"
            type="text"
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
            placeholder="0x..."
            className="wallet-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message Content</label>
          <textarea
            id="message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message here..."
            className="message-textarea"
            rows={6}
            maxLength={maxCharacters}
          />
          <div className="character-count">
            {characterCount}/{maxCharacters}
          </div>
        </div>

        <div className="token-section">
          <div className="form-group">
            <label htmlFor="amount">Token Amount</label>
            <input
              id="amount"
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(Number(e.target.value))}
              min="0"
              max="10000"
              className="amount-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="token-type">Token Type</label>
            <select
              id="token-type"
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value as 'FLBY' | 'SHEEP')}
              className="token-select"
            >
              <option value="FLBY">FLBY</option>
              <option value="SHEEP">SHEEP</option>
            </select>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="warnings">
            {warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                ⚠️ {warning}
              </div>
            ))}
          </div>
        )}

        {errors.length > 0 && (
          <div className="errors">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                ❌ {error}
              </div>
            ))}
          </div>
        )}

        <button
          className="send-button"
          onClick={handleSend}
          disabled={sending || errors.length > 0}
        >
          {sending ? 'Sending...' : `Send Message + ${tokenAmount} ${tokenType}`}
        </button>
      </div>
    </div>
  );
}