import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$LandingLayout } from '../../chunks/LandingLayout_BtSLaMKR.mjs';
import { $ as $$Hero2 } from '../../chunks/Hero2_BpgdZU_8.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_BuAFA3-E.mjs';
export { renderers } from '../../renderers.mjs';

const $$Sales = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Sales Landing Page Demo"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$LandingLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero2", $$Hero2, { "tagline": "Long-form Sales Demo", "title": "Long-form Sales: Sell with a Story: The Long-form Way!", "subtitle": "Dive deep into crafting a Landing Page that narrates, persuades, and converts.", "actions": [
    { variant: "primary", text: "Call to Action", href: "#", icon: "tabler:square-rounded-arrow-right" },
    { text: "Learn more", href: "#" }
  ], "image": {
    src: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80",
    alt: "Children telling a story. Long-form Sales Landing Page demo"
  } })} ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Coming soon", "subtitle": "We are working on the content of these demo pages. You will see them very soon. Stay tuned Stay tuned!", "actions": [
    {
      variant: "primary",
      text: "Download Template",
      href: "https://github.com/arthelokyo/astrowind",
      icon: "tabler:download"
    }
  ] })} ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/landing/sales.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/landing/sales.astro";
const $$url = "/landing/sales";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sales,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
