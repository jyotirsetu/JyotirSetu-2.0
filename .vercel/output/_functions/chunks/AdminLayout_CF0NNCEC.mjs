import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, f as renderSlot } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_BlfsazVo.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { metadata } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderSlot($$result2, $$slots["default"])} </main> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
