import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import vercel from '@astrojs/vercel';

import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),
  build: {
    format: 'file',
    assets: '_astro',
  },
  prerender: {
    default: false,
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => {
        // Exclude admin pages (private)
        if (page.includes('/admin')) return false;
        
        // Exclude blog and template demo pages (not used)
        if (page.includes('/blog') || 
            page.includes('/category/') || 
            page.includes('/tag/') ||
            page.includes('/astrowind-template') ||
            page.includes('/get-started-website') ||
            page.includes('/how-to-customize') ||
            page.includes('/markdown-elements') ||
            page.includes('/useful-resources')) return false;
        
        // Exclude landing page templates (not used for business)
        if (page.includes('/landing') || 
            page.includes('/homes/')) return false;
        
        // Exclude pages that don't exist
        if (page.includes('/pricing') || 
            page.includes('/resources')) return false;
        
        return true;
      },
      // Add custom URLs for blog integration
      customPages: [
        'https://www.blog.jyotirsetu.com',
        'https://www.blog.jyotirsetu.com/blog',
      ]
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
