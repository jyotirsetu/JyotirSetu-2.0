import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$CorporateConsultation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';
import ServicePageEnhancer from '~/components/widgets/ServicePageEnhancer.astro';`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/services/corporate-consultation.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/services/corporate-consultation.astro";
const $$url = "/services/corporate-consultation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$CorporateConsultation,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
