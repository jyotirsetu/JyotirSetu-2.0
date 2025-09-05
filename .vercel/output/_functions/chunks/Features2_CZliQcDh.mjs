import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, F as Fragment, a as renderTemplate, u as unescapeHTML } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$WidgetWrapper } from './WidgetWrapper_D3qsqbz_.mjs';
import { $ as $$Headline } from './Headline_BGObqHO6.mjs';
import { c as $$Icon, b as $$Button } from './PageLayout_zwWBQsq-.mjs';
import { twMerge } from 'tailwind-merge';

const $$Astro$1 = createAstro("https://jyotirsetu.com");
const $$ItemGrid2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ItemGrid2;
  const { items = [], columns, defaultIcon = "", classes = {} } = Astro2.props;
  const {
    container: containerClass = "",
    // container: containerClass = "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    panel: panelClass = "",
    title: titleClass = "",
    description: descriptionClass = "",
    icon: defaultIconClass = "text-primary"
  } = classes;
  return renderTemplate`${items && items.length > 0 && renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge(
    `grid gap-8 gap-x-12 sm:gap-y-8 mobile-services-scroll ${columns === 4 ? "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" : columns === 3 ? "lg:grid-cols-3 sm:grid-cols-2" : columns === 2 ? "sm:grid-cols-2 " : ""}`,
    containerClass
  ), "class")}>${items.map(({ title, description, icon, href, callToAction, classes: itemClasses = {} }) => {
    const cardContent = renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${(icon || defaultIcon) && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": icon || defaultIcon, "class": twMerge("mb-2 w-10 h-10", defaultIconClass, itemClasses?.icon) })}`}<div${addAttribute(twMerge("text-xl font-bold", titleClass, itemClasses?.title), "class")}>${title}</div>${description && renderTemplate`<p${addAttribute(twMerge("text-muted mt-2", descriptionClass, itemClasses?.description), "class")}>${unescapeHTML(description)}</p>`}${callToAction && renderTemplate`<div class="mt-2">${renderComponent($$result2, "Button", $$Button, { ...callToAction })}</div>`}` })}`;
    if (href) {
      return renderTemplate`<a${addAttribute(href, "href")}${addAttribute(twMerge(
        "group relative flex flex-col p-6 rounded-xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 intersect-once intersect-quarter intersect-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden",
        panelClass,
        itemClasses?.panel
      ), "class")}><div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div><div class="relative z-10">${cardContent}</div><div class="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div><div class="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-100"></div></a>`;
    }
    return renderTemplate`<div${addAttribute(twMerge(
      "group relative flex flex-col p-6 rounded-xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 intersect-once intersect-quarter intersect-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade transition-all duration-300 hover:scale-105 hover:-translate-y-2 overflow-hidden",
      panelClass,
      itemClasses?.panel
    ), "class")}><div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div><div class="relative z-10">${cardContent}</div><div class="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div><div class="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-100"></div></div>`;
  })}</div>`}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/ui/ItemGrid2.astro", void 0);

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Features2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features2;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 3,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": classes?.headline })}  ${maybeRenderHead()}<div class="md:hidden text-center mb-6"> <p class="text-sm text-muted">← Swipe to see more services →</p> </div> ${renderComponent($$result2, "ItemGrid2", $$ItemGrid2, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "gap-4 md:gap-6",
    panel: "rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur border border-[#ffffff29] bg-white dark:bg-slate-900 p-6",
    // panel:
    //   "text-center bg-page items-center md:text-left rtl:md:text-right md:items-start p-6 p-6 rounded-md shadow-xl dark:shadow-none dark:border dark:border-slate-800",
    icon: "w-12 h-12 mb-6 text-primary",
    ...classes?.items ?? {}
  } })}  <div class="md:hidden mt-8 text-center"> <div class="flex justify-center space-x-2"> <div class="w-2 h-2 bg-blue-400 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> </div> </div> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/Features2.astro", void 0);

export { $$Features2 as $ };
