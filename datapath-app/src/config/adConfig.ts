import type { AdProvider } from '../components/AdSpace';

/**
 * Ad Settings - Can be easily modified
 * Weight: Appearance probability
 * Enabled: Enable/Disable Ad
 */
// Valid Ad Code - Used in all banners
const WORKING_AD_CODE = `<script async="async" data-cfasync="false" src="https://pl29178744.profitablecpmratenetwork.com/800d5e90b5b2e1db5b501b1508428e31/invoke.js"></script>
<div id="container-800d5e90b5b2e1db5b501b1508428e31"></div>`;

export const AD_PROVIDERS: AdProvider[] = [
  {
    id: 'adsterra_main',
    name: 'Adsterra Main Banner',
    code: WORKING_AD_CODE,
    weight: 100,
    enabled: true
  },
  {
    id: 'native_banner',
    name: 'Native Banner',
    code: WORKING_AD_CODE,
    weight: 100,
    enabled: true
  },
  {
    id: 'social_banner',
    name: 'Social Banner',
    code: WORKING_AD_CODE,
    weight: 100,
    enabled: true
  }
];

/**
 * Fallback Ads in case main ad fails
 */
export const FALLBACK_AD_PROVIDERS: AdProvider[] = [
  {
    id: 'google_adsense',
    name: 'Google AdSense',
    code: `<!-- Google AdSense placeholder -->
<div style="padding: 20px; text-align: center; color: #666;">
  <small>Advertisement</small>
</div>`,
    weight: 5,
    enabled: false // Currently disabled
  }
];

/**
 * Get active ads list
 */
export const getActiveAdProviders = (): AdProvider[] => {
  return AD_PROVIDERS.filter(provider => provider.enabled);
};

/**
 * Get specific ad by ID
 */
export const getAdProviderById = (id: string): AdProvider | undefined => {
  return AD_PROVIDERS.find(provider => provider.id === id);
};

/**
 * Determine if ad should be displayed based on screen type
 * @param adType Ad type
 * @param breakpoint Breakpoint (screen)
 */
export const shouldShowAd = (adType: string, breakpoint: 'mobile' | 'tablet' | 'desktop'): boolean => {
  switch (adType) {
    case 'horizontal':
      // Horizontal ad only appears on large screens
      return breakpoint === 'desktop';
    case 'vertical':
      // Vertical ad appears on all screens
      return true;
    case 'square':
      // Square ad appears on all screens
      return true;
    case 'responsive':
      // Responsive ad appears on all screens
      return true;
    default:
      return true;
  }
};

/**
 * Get appropriate ad size based on screen type
 */
export const getAdDimensions = (adType: string, breakpoint: string): { width: number; height: number } => {
  const isMobile = breakpoint === 'mobile';

  switch (adType) {
    case 'horizontal':
      // On mobile: hide, but return dimensions for internal use
      return { width: 728, height: 90 };
    case 'vertical':
      return {
        width: isMobile ? 300 : 160,
        height: isMobile ? 250 : 600
      };
    case 'square':
    case 'responsive':
    default:
      return { width: 300, height: 250 };
  }
};

/**
 * Generate Responsive ad code
 * Used to generate ad that adapts to container size
 */
export const generateResponsiveAdCode = (publisherId: string, slotId: string): string => {
  return `
<div id="${slotId}" style="width:100%;height:auto;min-height:250px;"></div>
<script>
  (function() {
    var ad = document.createElement('script');
    ad.type = 'text/javascript';
    ad.async = true;
    ad.src = 'https://pl29177405.profitablecpmratenetwork.com/' + '${publisherId}' + '/invoke.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ad, s);
  })();
</script>`.trim();
};

/**
 * Get suitable ads list for screen type
 */
export const getAdProvidersForBreakpoint = (
  adType: string,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): AdProvider[] => {
  if (!shouldShowAd(adType, breakpoint)) {
    return [];
  }
  return getActiveAdProviders();
};


