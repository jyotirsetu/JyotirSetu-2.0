import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DO0nFTUR.mjs';
import { manifest } from './manifest_C24gyLtC.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/send-email.astro.mjs');
const _page4 = () => import('./pages/api/test.astro.mjs');
const _page5 = () => import('./pages/contact.astro.mjs');
const _page6 = () => import('./pages/homes/mobile-app.astro.mjs');
const _page7 = () => import('./pages/homes/personal.astro.mjs');
const _page8 = () => import('./pages/homes/saas.astro.mjs');
const _page9 = () => import('./pages/homes/startup.astro.mjs');
const _page10 = () => import('./pages/landing/click-through.astro.mjs');
const _page11 = () => import('./pages/landing/lead-generation.astro.mjs');
const _page12 = () => import('./pages/landing/pre-launch.astro.mjs');
const _page13 = () => import('./pages/landing/product.astro.mjs');
const _page14 = () => import('./pages/landing/sales.astro.mjs');
const _page15 = () => import('./pages/landing/subscription.astro.mjs');
const _page16 = () => import('./pages/pricing.astro.mjs');
const _page17 = () => import('./pages/privacy.astro.mjs');
const _page18 = () => import('./pages/resources.astro.mjs');
const _page19 = () => import('./pages/rss.xml.astro.mjs');
const _page20 = () => import('./pages/scheduleappointmentjyotirsetu.astro.mjs');
const _page21 = () => import('./pages/services/career-finance.astro.mjs');
const _page22 = () => import('./pages/services/corporate-consultation.astro.mjs');
const _page23 = () => import('./pages/services/dosha-analysis.astro.mjs');
const _page24 = () => import('./pages/services/gemstone-consultation.astro.mjs');
const _page25 = () => import('./pages/services/kundli-analysis.astro.mjs');
const _page26 = () => import('./pages/services/matchmaking.astro.mjs');
const _page27 = () => import('./pages/services/numerology.astro.mjs');
const _page28 = () => import('./pages/services/palmistry.astro.mjs');
const _page29 = () => import('./pages/services/remedial-solutions.astro.mjs');
const _page30 = () => import('./pages/services/spiritual-guidance.astro.mjs');
const _page31 = () => import('./pages/services/study-education.astro.mjs');
const _page32 = () => import('./pages/services.astro.mjs');
const _page33 = () => import('./pages/success-stories.astro.mjs');
const _page34 = () => import('./pages/terms.astro.mjs');
const _page35 = () => import('./pages/testimonials.astro.mjs');
const _page36 = () => import('./pages/thank-you.astro.mjs');
const _page37 = () => import('./pages/_---blog_/_category_/_---page_.astro.mjs');
const _page38 = () => import('./pages/_---blog_/_tag_/_---page_.astro.mjs');
const _page39 = () => import('./pages/_---blog_/_---page_.astro.mjs');
const _page40 = () => import('./pages/index.astro.mjs');
const _page41 = () => import('./pages/_---blog_.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/send-email.js", _page3],
    ["src/pages/api/test.js", _page4],
    ["src/pages/contact.astro", _page5],
    ["src/pages/homes/mobile-app.astro", _page6],
    ["src/pages/homes/personal.astro", _page7],
    ["src/pages/homes/saas.astro", _page8],
    ["src/pages/homes/startup.astro", _page9],
    ["src/pages/landing/click-through.astro", _page10],
    ["src/pages/landing/lead-generation.astro", _page11],
    ["src/pages/landing/pre-launch.astro", _page12],
    ["src/pages/landing/product.astro", _page13],
    ["src/pages/landing/sales.astro", _page14],
    ["src/pages/landing/subscription.astro", _page15],
    ["src/pages/pricing.astro", _page16],
    ["src/pages/privacy.md", _page17],
    ["src/pages/resources.astro", _page18],
    ["src/pages/rss.xml.ts", _page19],
    ["src/pages/ScheduleAppointmentJyotirSetu.astro", _page20],
    ["src/pages/services/career-finance.astro", _page21],
    ["src/pages/services/corporate-consultation.astro", _page22],
    ["src/pages/services/dosha-analysis.astro", _page23],
    ["src/pages/services/gemstone-consultation.astro", _page24],
    ["src/pages/services/kundli-analysis.astro", _page25],
    ["src/pages/services/matchmaking.astro", _page26],
    ["src/pages/services/numerology.astro", _page27],
    ["src/pages/services/palmistry.astro", _page28],
    ["src/pages/services/remedial-solutions.astro", _page29],
    ["src/pages/services/spiritual-guidance.astro", _page30],
    ["src/pages/services/study-education.astro", _page31],
    ["src/pages/services.astro", _page32],
    ["src/pages/success-stories.astro", _page33],
    ["src/pages/terms.md", _page34],
    ["src/pages/testimonials.astro", _page35],
    ["src/pages/thank-you.astro", _page36],
    ["src/pages/[...blog]/[category]/[...page].astro", _page37],
    ["src/pages/[...blog]/[tag]/[...page].astro", _page38],
    ["src/pages/[...blog]/[...page].astro", _page39],
    ["src/pages/index.astro", _page40],
    ["src/pages/[...blog]/index.astro", _page41]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "99dcc0ac-b14e-4d17-954b-4e8a796a86ac",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
