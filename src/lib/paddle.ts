// Paddle.js Integration for DEFFATEST
// This module handles all Paddle-related functionality including checkout and webhook verification

export interface PaddleConfig {
  FREE_PLAN_PRODUCT_ID: string;
  PRO_PLAN_PRODUCT_ID: string;
  CHAOS_PLAN_PRODUCT_ID: string;
  FREE_PLAN_PRICE_ID: string;
  PRO_PLAN_PRICE_ID: string;
  CHAOS_PLAN_PRICE_ID: string;
  CLIENT_SIDE_TOKEN: string;
  WEBHOOK_SECRET_KEY: string;
  SELLER_ID: string;
}

export const PADDLE_CONFIG: PaddleConfig = {
  // Using the exact product IDs and price IDs you provided
  FREE_PLAN_PRODUCT_ID: "pro_01jz3ee4whjwf0bsb0n0k779pw",
  FREE_PLAN_PRICE_ID: "pri_01jz3ekbgqj5m5aese86kwpfxp",
  PRO_PLAN_PRODUCT_ID: "pro_01jz3epy40cqfamphkhxvnh2sc",
  PRO_PLAN_PRICE_ID: "pri_01jz3erkb3pft3ecw0dcz03yn2",
  CHAOS_PLAN_PRODUCT_ID: "pro_01jz3et66qhbxsxz0rm3751f8k",
  CHAOS_PLAN_PRICE_ID: "pri_01jz3ewz3rr7n92a26wf4s86ye",
  CLIENT_SIDE_TOKEN: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || "live_09ed53acf46a3d5e4cc657c32bf",
  WEBHOOK_SECRET_KEY: "ntfset_01jz3f3edwwmee1cd9z6gjgcr3",
  SELLER_ID: "236561" // Paddle Seller ID
};

// Declare Paddle types for TypeScript
declare global {
  interface Window {
    Paddle?: {
      // Paddle Billing (v2) methods
      Initialize: (options: { 
        token: string;
        eventCallback?: (data: any) => void;
      }) => void;
      Checkout: {
        open: (options: PaddleCheckoutOptions) => void;
      };
      Environment?: {
        set: (environment: 'sandbox' | 'production') => void;
      };
    };
  }
}

export interface PaddleCheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customer?: {
    email?: string;
    id?: string;
  };
  settings?: {
    successUrl?: string;
    cancelUrl?: string;
    displayMode?: 'overlay' | 'redirect';
    theme?: 'dark' | 'light';
    locale?: string;
  };
  transactionId?: string;
}

// Initialize Paddle.js with improved error handling and logging
export const initializePaddle = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Make sure we're in the browser
    if (typeof window === 'undefined') {
      console.warn('Paddle can only be initialized in browser environment');
      resolve(); // Resolve anyway to prevent blocking
      return;
    }

    // Check if Paddle script is already loaded
    if (window.Paddle) {
      console.log('Paddle already loaded, configuring...');
      
      try {
        configurePaddle();
        resolve();
      } catch (error) {
        console.error('Error configuring Paddle:', error);
        resolve(); // Resolve anyway to prevent blocking
      }
      return;
    }
    
    console.log('Loading Paddle.js script...');

    // Load Paddle script
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Paddle.js script loaded successfully');
      try {
        configurePaddle();
        resolve();
      } catch (error) {
        console.error('Error configuring Paddle after load:', error);
        resolve(); // Resolve anyway to prevent blocking
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Paddle.js script:', error);
      resolve(); // Resolve anyway to prevent blocking
    };
    
    document.head.appendChild(script);
  });
};

// Configure Paddle with proper error handling for Paddle Billing (v2)
function configurePaddle() {
  if (!window.Paddle) {
    console.warn('Paddle not available yet');
    return;
  }

  try {
    // Set environment to production first
    if (window.Paddle.Environment && typeof window.Paddle.Environment.set === 'function') {
      window.Paddle.Environment.set('production');
    }
    
    // Initialize with Paddle Billing v2 - using token only
    if (typeof window.Paddle.Initialize === 'function') {
      window.Paddle.Initialize({
        token: PADDLE_CONFIG.CLIENT_SIDE_TOKEN,
        eventCallback: (data: any) => {
          console.log('Paddle.js event:', data);
        }
      });
      
      console.log('Paddle initialized with token in production environment');
    } else {
      console.error('Paddle.Initialize is not a function. Make sure you are using Paddle Billing v2.');
    }
  } catch (error) {
    console.error('Error during Paddle initialization:', error);
  }
}

// Open Paddle checkout with improved error handling
export const openPaddleCheckout = (options: PaddleCheckoutOptions): void => {
  if (typeof window === 'undefined') {
    console.error('Paddle checkout can only be opened in browser environment');
    return;
  }

  if (!window.Paddle) {
    console.error('Paddle is not initialized, attempting to initialize now...');
    initializePaddle().then(() => {
      tryOpenCheckout();
    });
    return;
  }
  
  tryOpenCheckout();
  
  function tryOpenCheckout() {
    if (!window.Paddle?.Checkout) {
      console.error('Paddle Checkout not available');
      return;
    }

    try {
      // Ensure we have valid items
      if (!options.items || options.items.length === 0) {
        console.error('No items provided for checkout');
        return;
      }

      // Validate price IDs
      for (const item of options.items) {
        if (!item.priceId || item.priceId.trim() === '') {
          console.error('Invalid or empty price ID provided');
          return;
        }
      }

      // Build clean checkout options
      const checkoutOptions: any = {
        items: options.items
      };

      // Add customer data if available
      if (options.customer && options.customer.email) {
        checkoutOptions.customer = {
          email: options.customer.email
        };
        
        // Only add customer ID if it's a valid string
        if (options.customer.id && options.customer.id.trim() !== '') {
          checkoutOptions.customer.id = options.customer.id;
        }
      }

      // Add settings if provided
      if (options.settings) {
        checkoutOptions.settings = {
          displayMode: options.settings.displayMode || 'overlay',
          theme: options.settings.theme || 'dark',
          locale: options.settings.locale || 'en'
        };
        
        // Add success and cancel URLs if provided
        if (options.settings.successUrl) {
          checkoutOptions.settings.successUrl = options.settings.successUrl;
        }
        if (options.settings.cancelUrl) {
          checkoutOptions.settings.closeUrl = options.settings.cancelUrl;
        }
      }
      
      console.log('Opening Paddle checkout with options:', checkoutOptions);
      window.Paddle.Checkout.open(checkoutOptions);
      console.log('Paddle checkout opened successfully');
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
    }
  }
};

// Get product ID for plan type
export const getProductIdForPlan = (planType: string): string => {
  switch (planType) {
    case 'free':
      return PADDLE_CONFIG.FREE_PLAN_PRODUCT_ID;
    case 'pro':
      return PADDLE_CONFIG.PRO_PLAN_PRODUCT_ID;
    case 'chaos':
      return PADDLE_CONFIG.CHAOS_PLAN_PRODUCT_ID;
    default:
      throw new Error(`Unknown plan type: ${planType}`);
  }
};

// Get price ID for plan type
export const getPriceIdForPlan = (planType: string): string => {
  switch (planType) {
    case 'free':
      return PADDLE_CONFIG.FREE_PLAN_PRICE_ID;
    case 'pro':
      return PADDLE_CONFIG.PRO_PLAN_PRICE_ID;
    case 'chaos':
      return PADDLE_CONFIG.CHAOS_PLAN_PRICE_ID;
    default:
      throw new Error(`Unknown plan type: ${planType}`);
  }
};

// Plan configuration
export const PLAN_CONFIG = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'month',
    features: [
      '1 AI Test / Month',
      'Max 5 min per test duration',
      'Comprehensive Bug Report (Downloadable ZIP)',
      'Standard Queue'
    ],
    testsPerMonth: 1,
    maxTestDuration: 5,
    concurrentSlots: 1,
    webSlots: 0,
    appSlots: 0,
    apiAccess: false,
    detailedLogs: false,
    advancedAnalytics: false
  },
  pro: {
    name: 'Pro',
    price: '$110',
    period: 'month',
    features: [
      '25 AI Tests / Month',
      'Max 2 hours per test duration',
      'Comprehensive Bug Report (Downloadable ZIP)',
      'Priority Queue',
      '**Concurrent Test Slots:**',
      '2 Web Test Slots',
      '2 App Test Slots',
      '(Total 4 simultaneous tests)',
      'Access to Detailed Test Logs'
    ],
    testsPerMonth: 25,
    maxTestDuration: 120,
    concurrentSlots: 4,
    webSlots: 2,
    appSlots: 2,
    apiAccess: false,
    detailedLogs: true,
    advancedAnalytics: false
  },
  chaos: {
    name: 'Chaos',
    price: '$350',
    period: 'month',
    features: [
      'Unlimited AI Tests / Month',
      'Max 6 hours per test duration',
      'Comprehensive Bug Report (Downloadable ZIP)',
      'Instant Queue',
      '**Concurrent Test Slots:**',
      '4 Web Test Slots',
      '4 App Test Slots',
      '(Total 8 simultaneous tests)',
      'Full API Access (for CI/CD integration)',
      'Access to Advanced Analytics'
    ],
    testsPerMonth: -1, // Unlimited
    maxTestDuration: 360,
    concurrentSlots: 8,
    webSlots: 4,
    appSlots: 4,
    apiAccess: true,
    detailedLogs: true,
    advancedAnalytics: true
  }
};

export default {
  initializePaddle,
  openPaddleCheckout,
  getProductIdForPlan,
  getPriceIdForPlan,
  PADDLE_CONFIG,
  PLAN_CONFIG
};