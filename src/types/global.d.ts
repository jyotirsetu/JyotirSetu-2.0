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
