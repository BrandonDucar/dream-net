export interface CreatorProfile {
  id: string;
  socials: {
    instagram: string;
    x: string;
    tiktok: string;
    facebook?: string;
  };
  interests: string[];
  preferredProducts: string[];
  monetizationGoal: 'passive' | 'active' | 'hybrid';
  autoPilotLevel: 'minimal' | 'moderate' | 'full';
}

export interface OnboardingResult {
  profile: CreatorProfile;
  trendSuggestions: string[];
  recommendedProducts: string[];
  contentPacks: string[];
  contentSchedule: ContentScheduleItem[];
  landingPage: LandingPageConfig;
  analytics: CreatorAnalytics;
  recommendedActions: string[];
  personalizedInsights: {
    primaryFocus: string;
    monetizationStrategy: string;
    contentPillars: string[];
    growthOpportunities: string[];
  };
}

export interface CreatorAnalytics {
  creatorTier: {
    tier: string;
    dreamScore: {
      current: number;
      max: number;
    };
    topPost: {
      title: string;
      views: string;
      performance: string;
    };
    remixInvites: {
      pending: number;
      status: string;
    };
    airdropBonus: {
      token: string;
      multiplier: string;
      status: string;
    };
    tierBenefits: {
      tokenMultiplier: string;
      royaltyPercentage: string;
      bonusRewards: string;
      unlockedBadge: string;
      specialFeature: string;
    };
  };
  weeklyPerformance: {
    topPerformingPost: {
      title: string;
      views: string;
      ctr: string;
      platform: string;
    };
    bestConvertingProduct: {
      title: string;
      sales: number;
      conversionRate: string;
    };
    optimalPostingTime: {
      day: string;
      time: string;
      trafficIncrease: string;
      reason: string;
    };
  };
  growthMetrics: {
    followerGrowth: string;
    engagementRate: string;
    reachIncrease: string;
    saveRate: string;
  };
  contentInsights: {
    topPerformingContentType: string;
    bestPerformingHashtags: string[];
    audienceActiveHours: string[];
    contentRecommendations: string[];
  };
  dataOptimizations: {
    formatPerformance: {
      reelsEngagement: string;
      carouselEngagement: string;
      recommendation: string;
    };
    partnershipOpportunities: {
      suggestedPartner: string;
      expectedCtrIncrease: string;
      strategy: string;
    };
    newProductRecommendation: {
      productName: string;
      trendStatus: string;
      expectedRevenue: string;
    };
    timingOptimization: {
      optimalTime: string;
      performanceWindow: string;
      comparedToAverage: string;
    };
  };
  networkCollaboration: {
    connectedNode: {
      title: string;
      type: string;
    };
    remixRequest: {
      from: string;
      content: string;
      action: string;
    };
    groupOpportunity: {
      name: string;
      memberCount: number;
      model: string;
      status: string;
    };
    tokenDropAccess: {
      token: string;
      status: string;
      value: string;
    };
  };
}

export interface LandingPageConfig {
  url: string;
  title: string;
  description: string;
  productLinks: ProductLink[];
  bioLink: {
    url: string;
    protocol: string;
    actions: string[];
  };
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  heroSection: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
}

export interface ProductLink {
  title: string;
  description: string;
  price?: string;
  category: 'physical' | 'digital' | 'service' | 'token';
  icon: string;
}

export interface ContentScheduleItem {
  day: string;
  time: string;
  content: string;
  platforms: string[];
  contentType: 'meme' | 'reel' | 'carousel' | 'story' | 'post' | 'thread';
}

// Function to parse social media handles from user input
function parseSocialHandles(input: string): Partial<CreatorProfile['socials']> {
  const socials: Partial<CreatorProfile['socials']> = {};
  
  // Parse format like "x:@yourhandle instagram:@yourhandle tiktok:@yourhandle facebook:@yourname"
  const lines = input.split('\n').map(line => line.trim()).filter(line => line);
  
  for (const line of lines) {
    const [platform, handle] = line.split(':').map(part => part.trim());
    const cleanHandle = handle?.replace('@', '') || '';
    
    switch (platform?.toLowerCase()) {
      case 'x':
      case 'twitter':
        socials.x = cleanHandle;
        break;
      case 'instagram':
      case 'ig':
        socials.instagram = cleanHandle;
        break;
      case 'tiktok':
      case 'tt':
        socials.tiktok = cleanHandle;
        break;
      case 'facebook':
      case 'fb':
        socials.facebook = cleanHandle;
        break;
    }
  }
  
  return socials;
}

// Function to parse interests from user input
function parseInterests(input: string): string[] {
  const interests = input
    .split(',')
    .map(interest => interest.trim().toLowerCase())
    .filter(interest => interest.length > 0);
  
  // Normalize common variations
  const normalizedInterests = interests.map(interest => {
    if (interest.includes('pickle')) return 'pickleball';
    if (interest.includes('quote') || interest.includes('motivation')) return 'quotes';
    if (interest.includes('crypto') || interest.includes('alpha')) return 'crypto';
    if (interest.includes('ai') || interest.includes('tool')) return 'ai-tools';
    if (interest.includes('dad') || interest.includes('parent')) return 'dad-life';
    if (interest.includes('health') || interest.includes('wellness') || interest.includes('hack')) return 'health';
    if (interest.includes('collect')) return 'collectibles';
    return interest;
  });
  
  return Array.from(new Set(normalizedInterests)); // Remove duplicates
}

// Function to parse product preferences from user input
function parseProductPreferences(input: string): string[] {
  const products = input
    .split(',')
    .map(product => product.trim().toLowerCase())
    .filter(product => product.length > 0);
  
  // Normalize common variations
  const normalizedProducts = products.map(product => {
    if (product.includes('affiliate') || product.includes('link')) return 'affiliate-links';
    if (product.includes('coach') || product.includes('service')) return 'coaching';
    if (product.includes('tiktok') || product.includes('shop')) return 'tiktok-shop';
    if (product.includes('amazon')) return 'amazon-products';
    if (product.includes('digital') || product.includes('download')) return 'digital-downloads';
    if (product.includes('collect')) return 'collectibles';
    if (product.includes('merch') || product.includes('merchandise')) return 'merch';
    return product;
  });
  
  return Array.from(new Set(normalizedProducts)); // Remove duplicates
}

export async function runCreatorOnboarder(profile?: CreatorProfile): Promise<OnboardingResult> {
  try {
    const response = await fetch('/api/agents/creator-onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile })
    });

    if (!response.ok) {
      throw new Error(`Failed to run creator onboarder: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running creator onboarder:', error);
    
    // Fallback with realistic data based on provided profile
    const defaultProfile: CreatorProfile = profile || {
      id: 'uuid',
      socials: {
        instagram: 'bd420chef',
        x: 'BrandonDucar',
        tiktok: 'BScrypto72'
      },
      interests: ['pickleball', 'quotes', 'crypto', 'ai-tools', 'dad-life', 'health', 'collectibles'],
      preferredProducts: ['affiliate-links', 'coaching', 'tiktok-shop', 'amazon-products', 'digital-downloads', 'collectibles', 'merch'],
      monetizationGoal: 'hybrid',
      autoPilotLevel: 'full'
    };

    return generateOnboardingResult(defaultProfile);
  }
}

export function generateOnboardingResult(profile: CreatorProfile): OnboardingResult {
  const trendSuggestions = generateTrendSuggestions(profile);
  const recommendedProducts = generateRecommendedProducts(profile);
  const contentPacks = generateContentPacks(profile);
  const contentSchedule = generateContentSchedule(profile);
  const landingPage = generateLandingPage(profile);
  const analytics = generateCreatorAnalytics(profile);
  const recommendedActions = generateRecommendedActions(profile);
  const personalizedInsights = generatePersonalizedInsights(profile);

  return {
    profile,
    trendSuggestions,
    recommendedProducts,
    contentPacks,
    contentSchedule,
    landingPage,
    analytics,
    recommendedActions,
    personalizedInsights
  };
}

function generateTrendSuggestions(profile: CreatorProfile): string[] {
  const suggestions: string[] = [];
  
  // Interest-based suggestions
  if (profile.interests.includes('pickleball')) {
    suggestions.push(
      'Pickleball Trick Shots Compilation',
      'Pickleball Equipment Reviews',
      'Beginner Pickleball Training Series',
      'Pickleball Tournament Highlights'
    );
  }
  
  if (profile.interests.includes('crypto')) {
    suggestions.push(
      'Bitcoin Halving Countdown Products',
      'Crypto Portfolio Tracking Apps',
      'DeFi Yield Farming Guides',
      'NFT Collection Showcases'
    );
  }
  
  if (profile.interests.includes('quotes')) {
    suggestions.push(
      'Motivational Meme Journals for Dads',
      'Daily Wisdom Quote Cards',
      'Inspirational Quote Wall Art',
      'Mindfulness Quote Calendars'
    );
  }

  // Social platform-specific suggestions
  if (profile.socials.tiktok) {
    suggestions.push(
      'Short-Form Recipe Videos',
      'Quick Crypto Tips Series',
      'Daily Motivation Clips'
    );
  }

  if (profile.socials.instagram) {
    suggestions.push(
      'Food Photography Presets',
      'Story Template Bundles',
      'Reel Editing Tutorials'
    );
  }

  // Product preference integration
  if (profile.preferredProducts.includes('track-and-react ebook')) {
    suggestions.push(
      'Interactive Cooking Guides',
      'Crypto Trading Strategies Ebook',
      'Pickleball Technique Manuals'
    );
  }

  if (profile.preferredProducts.includes('flutterbye token drops')) {
    suggestions.push(
      'Limited Edition NFT Drops',
      'Exclusive Token Airdrops',
      'Community Access Tokens'
    );
  }

  return suggestions.slice(0, 8); // Return top 8 suggestions
}

function generateRecommendedProducts(profile: CreatorProfile): string[] {
  const products: string[] = [];

  // Generate products based on preferred product types
  if (profile.preferredProducts.includes('affiliate-links')) {
    products.push('High-Converting Affiliate Link Templates', 'Affiliate Marketing Strategy Course');
  }

  if (profile.preferredProducts.includes('coaching')) {
    products.push('1-on-1 Creator Coaching Sessions', 'Group Coaching Program Access');
  }

  if (profile.preferredProducts.includes('tiktok-shop')) {
    products.push('TikTok Shop Product Bundle', 'Viral Product Selection Guide');
  }

  if (profile.preferredProducts.includes('amazon-products')) {
    products.push('Amazon Affiliate Storefront Setup', 'Product Review Template Pack');
  }

  if (profile.preferredProducts.includes('digital-downloads')) {
    products.push('Premium Digital Asset Collection', 'Content Creator Toolkit Bundle');
  }

  if (profile.preferredProducts.includes('collectibles')) {
    products.push('Limited Edition Creator NFTs', 'Exclusive Physical Collectibles');
  }

  if (profile.preferredProducts.includes('merch')) {
    products.push('Custom Branded Merchandise Line', 'Print-on-Demand Setup Guide');
  }

  // Interest-based product recommendations
  if (profile.interests.includes('pickleball')) {
    products.push('Pickleball Performance Analytics Tool', 'Champion Mindset Course for Athletes');
  }
  
  if (profile.interests.includes('crypto')) {
    products.push('Dream Token Launch Kit', 'Crypto Creator Community Access');
  }

  if (profile.interests.includes('ai-tools')) {
    products.push('AI Content Creation Toolkit', 'Automated Social Media Manager');
  }

  if (profile.interests.includes('dad-life')) {
    products.push('Dad Life Content Calendar', 'Family-Friendly Creator Course');
  }

  if (profile.interests.includes('health')) {
    products.push('Health Hack Video Series', 'Wellness Creator Blueprint');
  }
  
  if (profile.interests.includes('quotes')) {
    products.push('Daily Affirmations Premium Pack', 'Motivational Quote Template Bundle');
  }

  // Platform-specific products
  if (profile.socials.instagram.includes('chef')) {
    products.push(
      'Recipe Card Templates',
      'Food Photography Presets',
      'Cooking Quote Collections'
    );
  }

  // Monetization goal-based products
  if (profile.monetizationGoal === 'passive') {
    products.push(
      'Printable Planner Templates',
      'Digital Wallpaper Collections',
      'Stock Photo Bundles'
    );
  } else if (profile.monetizationGoal === 'hybrid') {
    products.push(
      'Course Creation Templates',
      'Community Access Tokens',
      'Subscription Box Ideas'
    );
  }

  // Preferred product integration
  if (profile.preferredProducts.includes('track-and-react ebook')) {
    products.push(
      'Interactive Workbook Series',
      'Progress Tracking Templates'
    );
  }

  if (profile.preferredProducts.includes('flutterbye token drops')) {
    products.push(
      'NFT Collection Concepts',
      'Token Utility Designs'
    );
  }

  return Array.from(new Set(products)).slice(0, 6); // Remove duplicates and return top 6
}

function generateContentPacks(profile: CreatorProfile): string[] {
  const contentPacks: string[] = [];

  // Interest-based content packs
  if (profile.interests.includes('crypto')) {
    contentPacks.push(
      '🧠 Meme: "Buy the dip? I bought a Dream Token instead."',
      '📊 Infographic: "Crypto Portfolio Diversification for Beginners"',
      '🎥 Reel script: "Watch me make $100 with no followers using this trick…"',
      '📈 Chart: "Bitcoin vs Dream Tokens: 30-Day Performance"'
    );
  }

  if (profile.interests.includes('pickleball')) {
    contentPacks.push(
      '🎾 Tutorial: "Master the Perfect Pickleball Serve in 60 Seconds"',
      '📸 Carousel: "5 Common Pickleball Mistakes (And How to Fix Them)"',
      '🏆 Challenge: "30-Day Pickleball Skill Building Journey"'
    );
  }

  if (profile.interests.includes('quotes')) {
    contentPacks.push(
      '✨ Quote Card: "Dreams don\'t work unless you do. - John C. Maxwell"',
      '🎨 Typography: "Motivational Monday Quote Series"',
      '🗣️ CTA: "Share your favorite quote in the comments!"'
    );
  }

  // Platform-specific content
  if (profile.socials.instagram) {
    contentPacks.push(
      '📸 Carousel: "Top 5 Side Hustles with AI in 2025"',
      '📝 Story Template: "This or That - Content Creator Edition"',
      '🎨 Feed Post: "Behind the Scenes of My Daily Routine"'
    );
  }

  if (profile.socials.tiktok) {
    contentPacks.push(
      '🎵 Hook: "POV: You discovered the secret to passive income"',
      '⚡ Trending Audio: "Tell me you\'re a content creator without telling me"',
      '🔥 Viral Format: "Things that just make sense" series'
    );
  }

  if (profile.socials.x) {
    contentPacks.push(
      '🧵 Thread: "7 lessons I learned building my first $1K online"',
      '💭 Tweet: "Unpopular opinion: Most side hustles aren\'t passive"',
      '🔗 Engagement: "Quote tweet with your biggest creator struggle"'
    );
  }

  // Monetization-focused content
  if (profile.monetizationGoal === 'hybrid') {
    contentPacks.push(
      '💰 Value Post: "Free vs Paid Content: How to Balance Both"',
      '🗣️ CTA: "Unlock your dream drop today."',
      '📊 Results: "Month 1 vs Month 6: My Creator Journey"'
    );
  }

  // Product preference integration
  if (profile.preferredProducts.includes('track-and-react ebook')) {
    contentPacks.push(
      '📚 Book Promo: "5 Pages That Changed My Perspective on Success"',
      '✍️ Quote: "Knowledge without action is just entertainment"'
    );
  }

  if (profile.preferredProducts.includes('flutterbye token drops')) {
    contentPacks.push(
      '🪙 Token Tease: "Something special is dropping this week..."',
      '🎁 Exclusive: "First 100 followers get early access to my token drop"'
    );
  }

  // Chef-specific content (based on Instagram handle)
  if (profile.socials.instagram.includes('chef')) {
    contentPacks.push(
      '👨‍🍳 Recipe: "5-Minute Meals That Don\'t Suck"',
      '🥘 Food Hack: "The secret ingredient restaurants don\'t want you to know"',
      '📱 Quick Tip: "Meal prep like a pro in 30 minutes"'
    );
  }

  return contentPacks.slice(0, 8); // Return top 8 content packs
}

function generateContentSchedule(profile: CreatorProfile): ContentScheduleItem[] {
  const schedule: ContentScheduleItem[] = [];

  // Base schedule structure based on autopilot level
  if (profile.autoPilotLevel === 'full') {
    // Monday - Start week strong
    schedule.push({
      day: 'Monday',
      time: '9:00 AM',
      content: profile.interests.includes('crypto') 
        ? 'Meme: "Buy the dip? I bought a Dream Token instead."'
        : 'Motivational Monday: "Dreams don\'t work unless you do"',
      platforms: ['X'],
      contentType: 'meme'
    });

    schedule.push({
      day: 'Monday',
      time: '12:00 PM',
      content: profile.interests.includes('pickleball')
        ? 'Reel: "Master the Perfect Pickleball Serve in 60 Seconds"'
        : 'Reel script: "Watch me make $100 with no followers using this trick…"',
      platforms: ['Instagram', 'TikTok'],
      contentType: 'reel'
    });

    schedule.push({
      day: 'Monday',
      time: '3:00 PM',
      content: 'Carousel: "Top 5 Side Hustles with AI in 2025"',
      platforms: ['Facebook'],
      contentType: 'carousel'
    });

    // Wednesday - Mid-week engagement
    schedule.push({
      day: 'Wednesday',
      time: '11:00 AM',
      content: profile.interests.includes('quotes')
        ? 'Quote Card: "Knowledge without action is just entertainment"'
        : 'Value Post: "3 things I wish I knew before starting"',
      platforms: ['Instagram', 'X'],
      contentType: 'post'
    });

    // Friday - Week wrap-up and motivation
    schedule.push({
      day: 'Friday',
      time: '8:00 PM',
      content: 'CTA: "Unlock your dream drop today."',
      platforms: ['Instagram Stories', 'TikTok', 'X', 'Facebook'],
      contentType: 'story'
    });

    // Weekend content for engagement
    schedule.push({
      day: 'Saturday',
      time: '10:00 AM',
      content: profile.socials.instagram.includes('chef')
        ? 'Recipe: "5-Minute Meals That Don\'t Suck"'
        : 'Behind the Scenes: "My weekend creator routine"',
      platforms: ['Instagram', 'TikTok'],
      contentType: 'reel'
    });
  } else if (profile.autoPilotLevel === 'moderate') {
    // Reduced schedule for moderate automation
    schedule.push({
      day: 'Monday',
      time: '9:00 AM',
      content: 'Weekly motivation post',
      platforms: ['X'],
      contentType: 'post'
    });

    schedule.push({
      day: 'Wednesday',
      time: '12:00 PM',
      content: 'Mid-week value content',
      platforms: ['Instagram'],
      contentType: 'carousel'
    });

    schedule.push({
      day: 'Friday',
      time: '8:00 PM',
      content: 'Weekend engagement CTA',
      platforms: ['Instagram Stories'],
      contentType: 'story'
    });
  } else {
    // Minimal schedule for basic automation
    schedule.push({
      day: 'Monday',
      time: '12:00 PM',
      content: 'Weekly check-in post',
      platforms: ['X'],
      contentType: 'post'
    });

    schedule.push({
      day: 'Friday',
      time: '6:00 PM',
      content: 'End of week reflection',
      platforms: ['Instagram'],
      contentType: 'post'
    });
  }

  // Add platform-specific optimizations
  if (profile.socials.tiktok && profile.interests.includes('crypto')) {
    schedule.push({
      day: 'Tuesday',
      time: '7:00 PM',
      content: 'Trending Audio: "Tell me you\'re into crypto without telling me"',
      platforms: ['TikTok'],
      contentType: 'reel'
    });
  }

  if (profile.socials.x && profile.monetizationGoal === 'hybrid') {
    schedule.push({
      day: 'Thursday',
      time: '2:00 PM',
      content: 'Thread: "7 lessons I learned building my first $1K online"',
      platforms: ['X'],
      contentType: 'thread'
    });
  }

  return schedule;
}

function generateLandingPage(profile: CreatorProfile): LandingPageConfig {
  // Generate personalized URL based on social handles
  const username = profile.socials.instagram || profile.socials.x || profile.socials.tiktok || 'creator';
  const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  const landingPage: LandingPageConfig = {
    url: `dreamchasers.co/@${cleanUsername}`,
    title: `${cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)} - Dream Creator`,
    description: `Discover exclusive content, products, and experiences from ${cleanUsername}`,
    bioLink: {
      url: `dreamnetwork.xyz/dream/${cleanUsername}`,
      protocol: `dream://${cleanUsername}/mindset-monetizer`,
      actions: ['tip', 'remix', 'follow', 'shop', 'subscribe']
    },
    brandColors: {
      primary: '#00D4FF', // Cyan
      secondary: '#FFD700', // Gold
      accent: '#8B5CF6'    // Purple
    },
    heroSection: {
      headline: `Welcome to ${cleanUsername}'s Dream Hub`,
      subheadline: 'Transform your passions into reality with exclusive content and products',
      ctaText: 'Start Your Journey'
    },
    productLinks: []
  };

  // Generate product links based on interests and preferences
  if (profile.interests.includes('pickleball')) {
    landingPage.productLinks.push({
      title: 'Pickleball Motivation Shirts',
      description: 'Premium athletic wear with motivational quotes for champions',
      price: '$29.99',
      category: 'physical',
      icon: '🎾'
    });

    landingPage.productLinks.push({
      title: 'Book a Lesson',
      description: 'Personal pickleball coaching sessions with expert instruction',
      price: '$75/hour',
      category: 'service',
      icon: '🏆'
    });
  }

  if (profile.interests.includes('quotes') || profile.interests.includes('crypto')) {
    landingPage.productLinks.push({
      title: 'Viral Affirmation PDF',
      description: 'Daily affirmations and mindset shifts for success-driven creators',
      price: '$19.99',
      category: 'digital',
      icon: '✨'
    });
  }

  if (profile.interests.includes('crypto') || profile.preferredProducts.includes('flutterbye token drops')) {
    landingPage.productLinks.push({
      title: 'Dream Token Launchpad',
      description: 'Exclusive access to limited edition dream tokens and NFT drops',
      price: 'Variable',
      category: 'token',
      icon: '🚀'
    });
  }

  // Add content-specific products based on social handles
  if (profile.socials.instagram.includes('chef')) {
    landingPage.productLinks.push({
      title: 'Chef\'s Secret Recipe Collection',
      description: '50+ quick and healthy meal recipes for busy creators',
      price: '$24.99',
      category: 'digital',
      icon: '👨‍🍳'
    });
  }

  // Add track-and-react ebook if preferred
  if (profile.preferredProducts.includes('track-and-react ebook')) {
    landingPage.productLinks.push({
      title: 'Track & React Success Guide',
      description: 'Interactive workbook for tracking progress and building habits',
      price: '$39.99',
      category: 'digital',
      icon: '📚'
    });
  }

  // Customize based on monetization goals
  if (profile.monetizationGoal === 'passive') {
    landingPage.heroSection.headline = `${cleanUsername}'s Passive Income Hub`;
    landingPage.heroSection.subheadline = 'Build wealth while you sleep with proven digital products';
    landingPage.bioLink.protocol = `dream://${cleanUsername}/passive-income-stream`;
  } else if (profile.monetizationGoal === 'active') {
    landingPage.heroSection.headline = `Connect with ${cleanUsername}`;
    landingPage.heroSection.subheadline = 'Join an engaged community of dreamers and achievers';
    landingPage.bioLink.protocol = `dream://${cleanUsername}/community-builder`;
  }

  // Customize bio link based on interests
  if (profile.interests.includes('pickleball')) {
    landingPage.bioLink.protocol = `dream://${cleanUsername}/pickleball-mastery`;
  } else if (profile.interests.includes('crypto')) {
    landingPage.bioLink.protocol = `dream://${cleanUsername}/crypto-wealth`;
  } else if (profile.interests.includes('quotes')) {
    landingPage.bioLink.protocol = `dream://${cleanUsername}/daily-motivation`;
  }

  // Customize colors based on interests
  if (profile.interests.includes('crypto')) {
    landingPage.brandColors.accent = '#F7931A'; // Bitcoin orange
  } else if (profile.interests.includes('pickleball')) {
    landingPage.brandColors.accent = '#00A86B'; // Sports green
  }

  return landingPage;
}

function generateCreatorAnalytics(profile: CreatorProfile): CreatorAnalytics {
  const analytics: CreatorAnalytics = {
    creatorTier: {
      tier: 'Visionary',
      dreamScore: {
        current: 948,
        max: 1000
      },
      topPost: {
        title: 'Mindset Monetizer',
        views: '27.8K',
        performance: 'Reel format'
      },
      remixInvites: {
        pending: 12,
        status: 'pending'
      },
      airdropBonus: {
        token: '$SHEEP',
        multiplier: '+1.2x',
        status: 'unlocked'
      },
      tierBenefits: {
        tokenMultiplier: '2.5x',
        royaltyPercentage: '18%',
        bonusRewards: '+$25 in $SHEEP airdrop for top trending remix',
        unlockedBadge: 'Dream Architect',
        specialFeature: 'front-page feature'
      }
    },
    weeklyPerformance: {
      topPerformingPost: {
        title: 'Dream Fuel',
        views: '15.4K',
        ctr: '4.3%',
        platform: 'Instagram Reels'
      },
      bestConvertingProduct: {
        title: 'Pickleball Motivation Shirts',
        sales: 32,
        conversionRate: '21%'
      },
      optimalPostingTime: {
        day: 'Friday',
        time: '6:00 PM',
        trafficIncrease: '57%',
        reason: 'Weekend engagement spike + reel algorithm boost'
      }
    },
    growthMetrics: {
      followerGrowth: '+12.3%',
      engagementRate: '8.7%',
      reachIncrease: '+34.5%',
      saveRate: '15.2%'
    },
    contentInsights: {
      topPerformingContentType: 'Motivational Reels',
      bestPerformingHashtags: ['#DreamFuel', '#PickleballLife', '#MindsetMatters', '#CreateDaily'],
      audienceActiveHours: ['6-8 AM', '12-2 PM', '6-9 PM'],
      contentRecommendations: []
    },
    dataOptimizations: {
      formatPerformance: {
        reelsEngagement: '+78%',
        carouselEngagement: '<0.3%',
        recommendation: 'Focus on Reels: 78% more engagement than other formats'
      },
      partnershipOpportunities: {
        suggestedPartner: '@dreamtokqueen',
        expectedCtrIncrease: 'Cross-tag spikes affiliate CTR',
        strategy: 'Partner w/ @dreamtokqueen for cross-promotion campaigns'
      },
      newProductRecommendation: {
        productName: 'AI Growth Tracker Journal',
        trendStatus: 'Hot trend',
        expectedRevenue: 'High conversion potential based on current market demand'
      },
      timingOptimization: {
        optimalTime: '11:30 AM daily',
        performanceWindow: 'Best performance window based on 2-week analysis',
        comparedToAverage: 'Significantly outperforms other posting times'
      }
    },
    networkCollaboration: {
      connectedNode: {
        title: 'Dream Cloud - Monetized Mindset',
        type: 'Connected Node'
      },
      remixRequest: {
        from: '@focusfinance',
        content: 'Money Affirmation Reel',
        action: 'wants to remix'
      },
      groupOpportunity: {
        name: 'AI Wealth Toolkit',
        memberCount: 48,
        model: 'profit-split model',
        status: 'Suggested Join'
      },
      tokenDropAccess: {
        token: '$SHEEP',
        status: 'Auto-Whitelisted',
        value: 'Next drop access granted'
      }
    }
  };

  // Customize analytics based on interests
  if (profile.interests.includes('pickleball')) {
    analytics.creatorTier.tier = 'Athletic Visionary';
    analytics.creatorTier.topPost.title = 'Pickleball Mastery Guide';
    analytics.creatorTier.tierBenefits.unlockedBadge = 'Court Champion';
    analytics.creatorTier.tierBenefits.bonusRewards = '+$35 in $SPORT tokens for athletic content';
    analytics.creatorTier.tierBenefits.specialFeature = 'sports leaderboard feature';
    analytics.contentInsights.topPerformingContentType = 'Pickleball Tutorial Reels';
    analytics.contentInsights.bestPerformingHashtags = ['#PickleballTips', '#CourtLife', '#AthleteMindset', '#GameImprovement'];
    analytics.weeklyPerformance.topPerformingPost.title = 'Perfect Serve Technique';
    analytics.dataOptimizations.partnershipOpportunities.suggestedPartner = '@pickleballpro';
    analytics.dataOptimizations.newProductRecommendation.productName = 'Pickleball Performance Tracker';
    analytics.networkCollaboration.connectedNode.title = 'Dream Court - Athletic Excellence';
    analytics.networkCollaboration.remixRequest.from = '@courtmaster';
    analytics.networkCollaboration.remixRequest.content = 'Perfect Serve Tutorial';
    analytics.networkCollaboration.groupOpportunity.name = 'Pickleball Pros Network';
  }

  if (profile.interests.includes('crypto')) {
    analytics.creatorTier.tier = 'Crypto Visionary';
    analytics.creatorTier.dreamScore.current = 967;
    analytics.creatorTier.topPost.title = 'Crypto Wealth Strategy';
    analytics.creatorTier.airdropBonus.token = '$DREAM';
    analytics.creatorTier.airdropBonus.multiplier = '+1.5x';
    analytics.creatorTier.tierBenefits.tokenMultiplier = '3.2x';
    analytics.creatorTier.tierBenefits.royaltyPercentage = '22%';
    analytics.creatorTier.tierBenefits.unlockedBadge = 'Crypto Pioneer';
    analytics.creatorTier.tierBenefits.bonusRewards = '+$50 in $DREAM tokens for DeFi content';
    analytics.creatorTier.tierBenefits.specialFeature = 'crypto trending spotlight';
    analytics.weeklyPerformance.topPerformingPost.title = 'Crypto Dream Analysis';
    analytics.contentInsights.bestPerformingHashtags = ['#CryptoMindset', '#DreamTokens', '#DigitalWealth', '#FutureReady'];
    analytics.weeklyPerformance.bestConvertingProduct = {
      title: 'Dream Token Launchpad',
      sales: 18,
      conversionRate: '28%'
    };
    analytics.dataOptimizations.partnershipOpportunities.suggestedPartner = '@cryptodreamqueen';
    analytics.dataOptimizations.newProductRecommendation.productName = 'Crypto Portfolio Dream Tracker';
    analytics.networkCollaboration.connectedNode.title = 'Dream Cloud - Crypto Wealth';
    analytics.networkCollaboration.remixRequest.from = '@cryptoking';
    analytics.networkCollaboration.remixRequest.content = 'Bitcoin Strategy Reel';
    analytics.networkCollaboration.groupOpportunity.name = 'Crypto Creators Collective';
    analytics.networkCollaboration.tokenDropAccess.token = '$DREAM';
  }

  if (profile.interests.includes('quotes')) {
    analytics.creatorTier.tier = 'Mindset Visionary';
    analytics.creatorTier.topPost.title = 'Daily Wisdom Collection';
    analytics.creatorTier.tierBenefits.unlockedBadge = 'Wisdom Guide';
    analytics.creatorTier.tierBenefits.bonusRewards = '+$30 in $INSPIRE tokens for motivational content';
    analytics.creatorTier.tierBenefits.specialFeature = 'daily motivation showcase';
    analytics.weeklyPerformance.topPerformingPost.title = 'Daily Motivation Quote';
    analytics.contentInsights.topPerformingContentType = 'Quote Cards';
    analytics.contentInsights.bestPerformingHashtags = ['#MondayMotivation', '#QuoteOfTheDay', '#Inspiration', '#MindsetShift'];
    analytics.dataOptimizations.newProductRecommendation.productName = 'Daily Affirmation Journal';
  }

  // Platform-specific adjustments
  if (profile.socials.tiktok) {
    analytics.weeklyPerformance.topPerformingPost.platform = 'TikTok';
    analytics.weeklyPerformance.optimalPostingTime.time = '7:00 PM';
    analytics.contentInsights.audienceActiveHours = ['7-9 AM', '3-5 PM', '7-10 PM'];
    analytics.dataOptimizations.timingOptimization.optimalTime = '11:30 AM daily';
    analytics.dataOptimizations.formatPerformance.recommendation = 'Focus on TikTok Reels: 78% more engagement';
  }

  if (profile.socials.instagram.includes('chef')) {
    analytics.weeklyPerformance.topPerformingPost.title = '5-Minute Healthy Meals';
    analytics.contentInsights.topPerformingContentType = 'Recipe Reels';
    analytics.contentInsights.bestPerformingHashtags = ['#QuickMeals', '#HealthyEating', '#MealPrep', '#ChefTips'];
    analytics.dataOptimizations.partnershipOpportunities.suggestedPartner = '@healthyfoodqueen';
    analytics.dataOptimizations.newProductRecommendation.productName = 'Healthy Meal Planner Journal';
  }

  // Monetization-based insights and data optimizations
  if (profile.monetizationGoal === 'passive') {
    analytics.contentInsights.contentRecommendations = [
      'Focus on Reels: 78% more engagement than other formats',
      'Cut carousels: low engagement <0.3%',
      'Add AI Growth Tracker Journal to funnel',
      'Post daily at 11:30 AM for optimal performance'
    ];
  } else if (profile.monetizationGoal === 'active') {
    analytics.contentInsights.contentRecommendations = [
      'Focus on Reels for maximum engagement',
      'Partner with complementary creators for cross-promotion',
      'Host live sessions at 11:30 AM peak window',
      'Eliminate low-performing carousel content'
    ];
  } else {
    analytics.contentInsights.contentRecommendations = [
      'Focus on Reels: 78% more engagement than other formats',
      'Partner w/ @dreamtokqueen for cross-tag affiliate CTR boost',
      'Cut carousels: low engagement <0.3%',
      'Add AI Growth Tracker Journal as new funnel item',
      'Post daily at 11:30 AM (best performance window)'
    ];
  }

  return analytics;
}

function generateRecommendedActions(profile: CreatorProfile): string[] {
  const actions: string[] = [];

  // Monetization goal-based actions
  switch (profile.monetizationGoal) {
    case 'passive':
      actions.push(
        'Set up automated content scheduling',
        'Create evergreen product listings',
        'Build email list for passive income'
      );
      break;
    case 'active':
      actions.push(
        'Schedule daily content creation sessions',
        'Engage with community regularly',
        'Launch interactive campaigns'
      );
      break;
    case 'hybrid':
      actions.push(
        'Balance automated and manual content',
        'Create both passive and active revenue streams',
        'Implement scalable engagement strategies'
      );
      break;
  }

  // Autopilot level-based actions
  switch (profile.autoPilotLevel) {
    case 'minimal':
      actions.push('Manual content approval required');
      break;
    case 'moderate':
      actions.push('Semi-automated posting with review');
      break;
    case 'full':
      actions.push(
        'Enable full automation suite',
        'Set up AI-driven content optimization',
        'Implement smart engagement algorithms'
      );
      break;
  }

  return actions;
}

function generatePersonalizedInsights(profile: CreatorProfile): {
  primaryFocus: string;
  monetizationStrategy: string;
  contentPillars: string[];
  growthOpportunities: string[];
} {
  // Determine primary focus based on interests and social presence
  let primaryFocus = 'Multi-niche Creator';
  if (profile.interests.includes('crypto') && profile.socials.tiktok.includes('crypto')) {
    primaryFocus = 'Crypto Education & Entertainment';
  } else if (profile.interests.includes('pickleball')) {
    primaryFocus = 'Sports & Lifestyle Content';
  }

  // Monetization strategy based on goals and products
  const monetizationStrategy = profile.monetizationGoal === 'hybrid' 
    ? 'Diversified Revenue: Passive products + Active engagement + Token drops'
    : `${profile.monetizationGoal} monetization with ${profile.preferredProducts.join(' and ')}`;

  // Content pillars from interests
  const contentPillars = profile.interests.map(interest => {
    switch (interest) {
      case 'pickleball': return 'Sports & Fitness';
      case 'quotes': return 'Motivation & Mindset';
      case 'crypto': return 'Financial Education';
      default: return interest.charAt(0).toUpperCase() + interest.slice(1);
    }
  });

  // Growth opportunities based on current setup
  const growthOpportunities = [
    'Cross-platform content repurposing',
    'Community building around shared interests',
    'Collaboration with other creators in your niches'
  ];

  if (profile.autoPilotLevel === 'full') {
    growthOpportunities.push('AI-powered audience analysis and targeting');
  }

  return {
    primaryFocus,
    monetizationStrategy,
    contentPillars,
    growthOpportunities
  };
}

export function createCreatorProfile(data: Partial<CreatorProfile>): CreatorProfile {
  return {
    id: data.id || generateUUID(),
    socials: {
      instagram: data.socials?.instagram || '',
      x: data.socials?.x || '',
      tiktok: data.socials?.tiktok || ''
    },
    interests: data.interests || [],
    preferredProducts: data.preferredProducts || [],
    monetizationGoal: data.monetizationGoal || 'hybrid',
    autoPilotLevel: data.autoPilotLevel || 'moderate'
  };
}

function generateUUID(): string {
  return 'creator-' + Math.random().toString(36).substr(2, 9);
}