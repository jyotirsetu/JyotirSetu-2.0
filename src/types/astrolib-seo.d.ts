declare module '@astrolib/seo' {
  import type { Component } from 'astro';

  export interface OpenGraph {
    url?: string;
    siteName?: string;
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
    description?: string;
    canonical?: string;
    openGraph?: OpenGraph;
    twitter?: {
      handle?: string;
      site?: string;
      cardType?: string;
    };
  }

  export const AstroSeo: Component<Props>;
}
