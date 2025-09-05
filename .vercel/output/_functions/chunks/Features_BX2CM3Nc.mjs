import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$WidgetWrapper } from './WidgetWrapper_D3qsqbz_.mjs';
import { $ as $$ItemGrid } from './ItemGrid_WE4SB4d5.mjs';
import { $ as $$Headline } from './Headline_BGObqHO6.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 2,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-5xl ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": classes?.headline })}  ${maybeRenderHead()}<div class="md:hidden text-center mb-6"> <p class="text-sm text-muted">← Swipe to see more features →</p> </div> ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "mobile-features-scroll",
    title: "md:text-[1.3rem]",
    icon: "text-white bg-primary rounded-full w-10 h-10 p-2 md:w-12 md:h-12 md:p-3 mr-4 rtl:ml-4 rtl:mr-0",
    ...classes?.items ?? {}
  } })}  <div class="md:hidden mt-8 text-center"> <div class="flex justify-center space-x-2"> <div class="w-2 h-2 bg-blue-400 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> <div class="w-2 h-2 bg-gray-300 rounded-full"></div> </div> </div> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/Features.astro", void 0);

export { $$Features as $ };
