// Global type declarations to fix @astrolib/seo issues
declare module '@astrolib/seo' {
  import type { Component } from 'astro';

  export interface OpenGraph {
    url?: string;
    siteName?: string;
    site_name?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: string;
  }

  export interface Props {
    title?: string;
    titleTemplate?: string;
    description?: string;
    canonical?: string;
    noindex?: boolean;
    nofollow?: boolean;
    openGraph?: OpenGraph;
    twitter?: {
      handle?: string;
      site?: string;
      cardType?: string;
    };
  }

  export const AstroSeo: Component<Props>;
  export default AstroSeo;
}

// Fix for the specific error
declare module '@astrolib/seo/src/AstroSeo.astro' {
  import type { Component } from 'astro';
  export default Component;
}

// Global window augmentations for admin scripts and analytics
declare global {
  interface Window {
    AdminNotify?: {
      success: (message: string, description?: string) => void;
      error: (message: string, description?: string) => void;
      info: (message: string, description?: string) => void;
    };
    dataLayer?: unknown[];
    __followHubInsightsLoaded?: boolean;
    FollowHubInsightsLoad?: () => void | Promise<void>;
    followVariant?: string;
  }
}

export {};
