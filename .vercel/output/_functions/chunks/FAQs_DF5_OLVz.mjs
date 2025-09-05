import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$Headline } from './Headline_BGObqHO6.mjs';
import { $ as $$ItemGrid } from './ItemGrid_SsA2RIYE.mjs';
import { $ as $$WidgetWrapper } from './WidgetWrapper_D3qsqbz_.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$FAQs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FAQs;
  const {
    title = "",
    subtitle = "",
    tagline = "",
    items = [],
    columns = 2,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline })}  ${maybeRenderHead()}<div class="md:hidden text-center mb-6"> <p class="text-sm text-muted">← Swipe to see more FAQs →</p> </div> ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": "tabler:chevron-right", "classes": {
    container: `${columns === 1 ? "max-w-4xl" : ""} gap-y-8 md:gap-y-12 mobile-faqs-scroll`,
    panel: "max-w-none",
    icon: "flex-shrink-0 mt-1 w-6 h-6 text-primary"
  } })}  <div class="md:hidden mt-8 text-center"> <div class="flex justify-center space-x-2"> <div class="w-2 h-2 bg-blue-400 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> </div> </div> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/FAQs.astro", void 0);

export { $$FAQs as $ };
