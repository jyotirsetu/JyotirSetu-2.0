import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$LandingLayout } from '../../chunks/LandingLayout_BTNLEhyY.mjs';
import { $ as $$Hero2 } from '../../chunks/Hero2_mk_p4HGj.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_CYipvZ0Y.mjs';
export { renderers } from '../../renderers.mjs';

const $$PreLaunch = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Pre-Launch Landing Page"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$LandingLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero2", $$Hero2, { "tagline": "Pre-launch Demo", "title": "Pre-launch Landing Page: Build the Hype Before the Big Reveal!", "subtitle": "Craft a tantalizing Coming Soon or Pre-Launch Landing Page that leaves visitors eagerly awaiting your launch.", "actions": [
    { variant: "primary", text: "Call to Action", href: "#", icon: "tabler:square-rounded-arrow-right" },
    { text: "Learn more", href: "#" }
  ], "image": {
    src: "https://images.unsplash.com/photo-1558803116-c1b4ac867b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    alt: "Store with a Coming Soon sign. Pre-launch Landing Page"
  } })} ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Coming soon", "subtitle": "We are working on the content of these demo pages. You will see them very soon. Stay tuned Stay tuned!", "actions": [
    {
      variant: "primary",
      text: "Download Template",
      href: "https://github.com/arthelokyo/astrowind",
      icon: "tabler:download"
    }
  ] })} ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/landing/pre-launch.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/landing/pre-launch.astro";
const $$url = "/landing/pre-launch";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PreLaunch,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
