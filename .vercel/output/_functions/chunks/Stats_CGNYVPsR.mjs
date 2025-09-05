import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$WidgetWrapper } from './WidgetWrapper_D3qsqbz_.mjs';
import { $ as $$Headline } from './Headline_BGObqHO6.mjs';
import { c as $$Icon } from './PageLayout_zwWBQsq-.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Stats;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    stats = [],
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-6xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline })} ${maybeRenderHead()}<div class="stats-grid-container"> ${stats && stats.map(({ amount, title: title2, icon, id: id2 }, index) => renderTemplate`<div class="stat-item"${addAttribute(id2, "data-stat-id")}${addAttribute(index, "data-stat-index")}> ${icon && renderTemplate`<div class="stat-icon"> ${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "class": "w-10 h-10" })} </div>`} ${amount && renderTemplate`<div class="stat-amount"> ${amount} </div>`} ${title2 && renderTemplate`<div class="stat-title"> ${title2} </div>`} </div>`)} </div> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/Stats.astro", void 0);

export { $$Stats as $ };
