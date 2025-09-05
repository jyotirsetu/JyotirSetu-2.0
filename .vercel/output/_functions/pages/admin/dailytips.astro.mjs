import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, e as renderScript, m as maybeRenderHead } from '../../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../../chunks/PageLayout_DOxrouzY.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Dailytips = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dailytips;
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": {
    title: "Daily Tips Manager - JyotirSetu Admin",
    description: "Manage daily astrology tips and cosmic insights"
  } }, { "default": async ($$result2) => renderTemplate`  ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/admin/dailytips.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900"> <!-- Admin Header --> <header class="bg-white dark:bg-slate-800 shadow-lg border-b border-purple-200 dark:border-purple-700"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center py-6"> <div class="flex items-center space-x-4"> <button onclick="goBackToAdminDashboard()" class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-transparent border-none cursor-pointer">
← Back to Admin Dashboard
</button> <div class="flex-shrink-0"> <h1 class="text-2xl font-bold text-purple-600 dark:text-purple-400">
✨ Daily Tips Manager
</h1> </div> </div> <div class="flex items-center space-x-4"> <span class="text-sm text-gray-600 dark:text-gray-400" id="admin-email">
Welcome, Admin
</span> <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
Logout
</button> </div> </div> </div> </header> <!-- Main Content --> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Quick Stats --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"> <span class="text-purple-600 dark:text-purple-400 text-xl">✨</span> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tips</p> <p class="text-2xl font-bold text-gray-900 dark:text-white" id="total-tips-count">0</p> </div> </div> </div> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"> <span class="text-green-600 dark:text-green-400 text-xl">📅</span> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tips</p> <p class="text-2xl font-bold text-gray-900 dark:text-white" id="active-tips-count">0</p> </div> </div> </div> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"> <span class="text-blue-600 dark:text-blue-400 text-xl">📝</span> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p> <p class="text-2xl font-bold text-gray-900 dark:text-white" id="categories-count">0</p> </div> </div> </div> </div> <!-- Create New Tip Section --> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 border border-purple-200 dark:border-purple-700"> <div class="text-center mb-6"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Daily Tip</h2> <p class="text-gray-600 dark:text-gray-400">Share cosmic insights with your audience</p> </div> <form id="tip-form" class="space-y-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tip Title</label> <input type="text" id="tip-title" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors" placeholder="e.g., Moon in Aries Energy"> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label> <select id="tip-category" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"> <option value="">Select Category</option> <option value="Zodiac">Zodiac Signs</option> <option value="Planets">Planetary Influences</option> <option value="Moon">Moon Phases</option> <option value="Gemstones">Gemstone Guidance</option> <option value="Numerology">Numerology</option> <option value="Palmistry">Palmistry</option> <option value="General">General Astrology</option> </select> </div> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tip Content</label> <textarea id="tip-content" required rows="4" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors" placeholder="Share your cosmic insight here..."></textarea> </div> <div class="flex justify-center"> <button type="submit" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
✨ Create Daily Tip
</button> </div> </form> </div> <!-- Existing Tips Section --> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-purple-200 dark:border-purple-700"> <div class="flex justify-between items-center mb-6"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Existing Daily Tips</h2> <button onclick="refreshTips()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
🔄 Refresh
</button> </div> <div id="existing-tips" class="space-y-4"> <div class="text-center text-gray-500 dark:text-gray-400 py-8"> <span class="text-4xl">✨</span> <p class="mt-2">Loading daily tips...</p> </div> </div> </div> </main> </div> ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/admin/dailytips.astro?astro&type=script&index=1&lang.ts")} ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/admin/dailytips.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/admin/dailytips.astro";
const $$url = "/admin/dailytips";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dailytips,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
