import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, e as renderScript, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../chunks/PageLayout_cVV0aLge.mjs';
import { $ as $$Hero } from '../chunks/Hero_BF_jfkyY.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Resources = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Resources;
  const metadata = {
    title: "Free Resources & Downloads - JyotirSetu",
    description: "Practical guides and remedies you can start today\u2014free downloads from JyotirSetu. Dosha guides, gemstone tips, and more."
  };
  const resources = [
    {
      id: 1,
      title: "\u{1F33F} Dosha Balancing Guide",
      description: "Complete guide to understanding and balancing Vata, Pitta, and Kapha doshas. Includes practical remedies, diet tips, and lifestyle recommendations.",
      category: "Health & Wellness",
      fileSize: "2.3 MB",
      downloads: 1250,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYXxlbnwwfDJ8MHx8fDI%3D",
      tags: ["Doshas", "Health", "Wellness", "Vedic Remedies"]
    },
    {
      id: 2,
      title: "\u{1F48E} Gemstone Therapy Handbook",
      description: "Comprehensive guide to gemstone therapy. Learn which stones to wear for different purposes and how to use them effectively.",
      category: "Gemstones",
      fileSize: "1.8 MB",
      downloads: 890,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2Vtc3RvbmVzfGVufDB8MnwwfHx8Mg%3D%3D",
      tags: ["Gemstones", "Healing", "Crystal Energy", "Therapy"]
    },
    {
      id: 3,
      title: "\u{1F522} Numerology Basics Guide",
      description: "Introduction to numerology including Life Path Numbers, Destiny Numbers, and how to calculate them. Perfect for beginners.",
      category: "Numerology",
      fileSize: "1.5 MB",
      downloads: 650,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bnVtYmVyc3xlbnwwfDJ8MHx8fDI%3D",
      tags: ["Numerology", "Life Path", "Destiny", "Numbers"]
    },
    {
      id: 4,
      title: "\u270B Palmistry Reading Guide",
      description: "Learn to read palm lines and understand what they reveal about personality, career, relationships, and life path.",
      category: "Palmistry",
      fileSize: "2.1 MB",
      downloads: 720,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZHN8ZW58MHwyfDB8fHwy",
      tags: ["Palmistry", "Palm Reading", "Life Lines", "Destiny"]
    },
    {
      id: 5,
      title: "\u{1F549}\uFE0F Daily Spiritual Practices",
      description: "Collection of daily spiritual practices including meditation techniques, mantras, and rituals for spiritual growth.",
      category: "Spirituality",
      fileSize: "1.2 MB",
      downloads: 980,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfDJ8MHx8fDI%3D",
      tags: ["Spirituality", "Meditation", "Mantras", "Daily Practices"]
    },
    {
      id: 6,
      title: "\u{1F4BC} Career Guidance Through Astrology",
      description: "How to use astrological insights for career planning, job changes, and professional development.",
      category: "Career",
      fileSize: "1.9 MB",
      downloads: 540,
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZWVyfGVufDB8MnwwfHx8Mg%3D%3D",
      tags: ["Career", "Astrology", "Professional Growth", "Job Guidance"]
    }
  ];
  const categories = ["All", "Health & Wellness", "Gemstones", "Numerology", "Palmistry", "Spirituality", "Career"];
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata, "data-astro-cid-gauq755v": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "title": "\u{1F4DA} Free Resources & Downloads", "subtitle": "Practical guides and remedies you can start today\u2014free downloads from JyotirSetu. Dosha guides, gemstone tips, and more.", "actions": [
    {
      variant: "primary",
      text: "Book Consultation",
      href: "/ScheduleAppointmentJyotirSetu",
      icon: "tabler:calendar"
    },
    { text: "Browse Resources", href: "#resources" }
  ], "image": { src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHwyfDB8fHwy", alt: "Free Resources" }, "data-astro-cid-gauq755v": true }, { "title": ($$result3) => renderTemplate`${maybeRenderHead()}<div data-astro-cid-gauq755v>
📚 <span class="text-accent dark:text-white" data-astro-cid-gauq755v>Free Resources</span> & Downloads
</div>` })}  <section class="py-8 bg-page border-b border-gray-200 dark:border-slate-700" data-astro-cid-gauq755v> <div class="max-w-7xl mx-auto px-6" data-astro-cid-gauq755v> <div class="flex flex-wrap justify-center gap-3" data-astro-cid-gauq755v> ${categories.map((category) => renderTemplate`<button class="resource-filter px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"${addAttribute(category === "All" ? "all" : category.toLowerCase().replace(" & ", "-").replace(" ", "-"), "data-category")}${addAttribute(category === "All" ? "true" : "false", "data-active")} data-astro-cid-gauq755v> ${category} </button>`)} </div> </div> </section>  <section id="resources" class="py-16 bg-page" data-astro-cid-gauq755v> <div class="max-w-7xl mx-auto px-6" data-astro-cid-gauq755v> <div class="text-center mb-12" data-astro-cid-gauq755v> <h2 class="text-3xl font-bold text-heading mb-4" data-astro-cid-gauq755v>Free Downloads for Your Journey</h2> <p class="text-lg text-muted" data-astro-cid-gauq755v>Start your transformation today with these practical guides and resources</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="resources-grid" data-astro-cid-gauq755v> ${resources.map((resource) => renderTemplate`<article class="resource-card bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"${addAttribute(resource.category.toLowerCase().replace(" & ", "-").replace(" ", "-"), "data-category")} data-astro-cid-gauq755v> <div class="relative" data-astro-cid-gauq755v> <img${addAttribute(resource.image, "src")}${addAttribute(resource.title, "alt")} class="w-full h-48 object-cover" data-astro-cid-gauq755v> <div class="absolute top-4 left-4" data-astro-cid-gauq755v> <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium" data-astro-cid-gauq755v> ${resource.category} </span> </div> <div class="absolute top-4 right-4" data-astro-cid-gauq755v> <span class="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs" data-astro-cid-gauq755v> ${resource.fileSize} </span> </div> </div> <div class="p-6" data-astro-cid-gauq755v> <h3 class="text-xl font-bold text-heading mb-3 line-clamp-2" data-astro-cid-gauq755v> ${resource.title} </h3> <p class="text-muted mb-4 line-clamp-3" data-astro-cid-gauq755v> ${resource.description} </p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-gauq755v> ${resource.tags.map((tag) => renderTemplate`<span class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs" data-astro-cid-gauq755v> ${tag} </span>`)} </div> <div class="flex items-center justify-between mb-4" data-astro-cid-gauq755v> <span class="text-sm text-muted" data-astro-cid-gauq755v>📥 ${resource.downloads.toLocaleString()} downloads</span> <span class="text-sm text-muted" data-astro-cid-gauq755v>📁 ${resource.fileSize}</span> </div> <button class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" data-astro-cid-gauq755v> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gauq755v> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-gauq755v></path> </svg>
Download Free
</button> </div> </article>`)} </div> <!-- Load More Button --> <div class="text-center mt-12" data-astro-cid-gauq755v> <button class="bg-secondary hover:bg-secondary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200" data-astro-cid-gauq755v>
Load More Resources
</button> </div> </div> </section>  <section class="py-16 bg-gradient-to-r from-primary/5 to-secondary/5" data-astro-cid-gauq755v> <div class="max-w-6xl mx-auto px-6" data-astro-cid-gauq755v> <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12" data-astro-cid-gauq755v> <div class="lg:flex items-center gap-12" data-astro-cid-gauq755v> <div class="lg:w-1/2 mb-8 lg:mb-0" data-astro-cid-gauq755v> <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 text-center" data-astro-cid-gauq755v> <div class="text-8xl mb-4" data-astro-cid-gauq755v>🌿</div> <h3 class="text-2xl font-bold text-heading mb-2" data-astro-cid-gauq755v>Dosha Balancing Guide</h3> <p class="text-muted mb-4" data-astro-cid-gauq755v>Our most popular free resource</p> <div class="text-3xl font-bold text-primary mb-2" data-astro-cid-gauq755v>2,500+ Downloads</div> </div> </div> <div class="lg:w-1/2" data-astro-cid-gauq755v> <h2 class="text-3xl font-bold text-heading mb-6" data-astro-cid-gauq755v>Transform Your Health with Ancient Wisdom</h2> <p class="text-muted mb-6" data-astro-cid-gauq755v>
Discover the three doshas (Vata, Pitta, Kapha) and learn practical remedies to balance them for optimal health and well-being. This comprehensive guide includes:
</p> <div class="space-y-3 mb-8" data-astro-cid-gauq755v> <div class="flex items-center gap-3" data-astro-cid-gauq755v> <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" data-astro-cid-gauq755v> <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gauq755v> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-gauq755v></path> </svg> </div> <span class="text-muted" data-astro-cid-gauq755v>Complete dosha analysis and identification</span> </div> <div class="flex items-center gap-3" data-astro-cid-gauq755v> <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" data-astro-cid-gauq755v> <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gauq755v> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-gauq755v></path> </svg> </div> <span class="text-muted" data-astro-cid-gauq755v>Personalized diet and lifestyle recommendations</span> </div> <div class="flex items-center gap-3" data-astro-cid-gauq755v> <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" data-astro-cid-gauq755v> <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gauq755v> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-gauq755v></path> </svg> </div> <span class="text-muted" data-astro-cid-gauq755v>Practical remedies and daily practices</span> </div> </div> <button class="w-full lg:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" data-astro-cid-gauq755v> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gauq755v> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-gauq755v></path> </svg>
Download Dosha Guide
</button> </div> </div> </div> </div> </section>  <section class="py-16 bg-page" data-astro-cid-gauq755v> <div class="max-w-4xl mx-auto px-6 text-center" data-astro-cid-gauq755v> <h2 class="text-3xl font-bold text-heading mb-4" data-astro-cid-gauq755v>Get New Resources First</h2> <p class="text-lg text-muted mb-8" data-astro-cid-gauq755v>Subscribe to receive new guides, remedies, and resources as soon as they're available</p> <div class="max-w-md mx-auto" data-astro-cid-gauq755v> <div class="flex gap-3" data-astro-cid-gauq755v> <input type="email" placeholder="Enter your email address" class="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white" data-astro-cid-gauq755v> <button class="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200" data-astro-cid-gauq755v>
Subscribe
</button> </div> <p class="text-sm text-muted mt-2" data-astro-cid-gauq755v>Get notified about new free resources and exclusive content</p> </div> </div> </section>  ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/resources.astro?astro&type=script&index=0&lang.ts")}  ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/resources.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/resources.astro";
const $$url = "/resources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Resources,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
