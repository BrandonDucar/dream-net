export interface MessageValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMessage(content: string, tokenAmount: number): MessageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Content validation
  if (!content || content.trim().length === 0) {
    errors.push('Message content cannot be empty');
  }

  if (content.length > 2048) {
    errors.push('Message content exceeds maximum length of 2048 characters');
  }

  if (content.length < 10) {
    warnings.push('Very short messages may not provide enough context');
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/g, // Repeated characters
    /https?:\/\/[^\s]+/g, // URLs (warning, not error)
    /^\s*([A-Z\s!]+)\s*$/g // ALL CAPS
  ];

  spamPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      if (index === 2) {
        warnings.push('Excessive capitalization detected');
      } else if (index === 1) {
        warnings.push('External links detected - verify recipient trust');
      } else {
        errors.push('Spam-like content detected');
      }
    }
  });

  // Token amount validation
  if (tokenAmount < 0) {
    errors.push('Token amount cannot be negative');
  }

  if (tokenAmount > 10000) {
    errors.push('Token amount exceeds maximum limit of 10,000');
  }

  if (tokenAmount === 0) {
    warnings.push('Zero token messages may have lower delivery priority');
  }

  // Profanity filter (basic implementation)
  const profanityList = ['spam', 'scam', 'fraud']; // Simplified list
  const containsProfanity = profanityList.some(word => 
    content.toLowerCase().includes(word.toLowerCase())
  );

  if (containsProfanity) {
    errors.push('Message contains flagged content');
  }

  // Positive content detection
  const positiveWords = ['thank', 'great', 'awesome', 'collaboration', 'dream'];
  const hasPositiveContent = positiveWords.some(word =>
    content.toLowerCase().includes(word.toLowerCase())
  );

  if (hasPositiveContent) {
    warnings.push('Positive content detected - trust score bonus eligible');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function sanitizeMessage(content: string): string {
  // Remove potentially dangerous characters
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export function analyzeMessageSentiment(content: string): {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
} {
  const positiveWords = ['thank', 'great', 'awesome', 'love', 'amazing', 'excellent'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible'];
  
  const words = content.toLowerCase().split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const totalEmotionalWords = positiveCount + negativeCount;
  
  if (totalEmotionalWords === 0) {
    return { sentiment: 'neutral', confidence: 0.5 };
  }
  
  const positiveRatio = positiveCount / totalEmotionalWords;
  
  if (positiveRatio > 0.6) {
    return { sentiment: 'positive', confidence: positiveRatio };
  } else if (positiveRatio < 0.4) {
    return { sentiment: 'negative', confidence: 1 - positiveRatio };
  } else {
    return { sentiment: 'neutral', confidence: 0.5 };
  }
}