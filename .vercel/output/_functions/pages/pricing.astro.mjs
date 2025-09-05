import { d as createAstro, c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { b as $$Button, $ as $$PageLayout } from '../chunks/PageLayout_DOxrouzY.mjs';
import { $ as $$Pricing$1 } from '../chunks/Pricing_ElAs6dB7.mjs';
import { $ as $$FAQs } from '../chunks/FAQs_CFasQuS3.mjs';
import { $ as $$Steps } from '../chunks/Steps_CYgLAREM.mjs';
import { $ as $$Features3 } from '../chunks/Features3_1SIVZDBn.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_CFc8aS-w.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$HeroText = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeroText;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    content = await Astro2.slots.render("content"),
    callToAction = await Astro2.slots.render("callToAction"),
    callToAction2 = await Astro2.slots.render("callToAction2")
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative md:-mt-[76px] not-prose"> <div class="absolute inset-0 pointer-events-none" aria-hidden="true"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6"> <div class="pt-0 md:pt-[76px] pointer-events-none"></div> <div class="py-12 md:py-20 pb-8 md:pb-8"> <div class="text-center max-w-5xl mx-auto"> ${tagline && renderTemplate`<p class="text-base text-secondary dark:text-blue-200 font-bold tracking-wide uppercase intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(tagline)}</p>`} ${title && renderTemplate`<h1 class="text-5xl md:text-6xl font-bold leading-tighter tracking-tighter mb-4 font-heading dark:text-gray-200 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(title)}</h1>`} <div class="max-w-3xl mx-auto"> ${subtitle && renderTemplate`<p class="text-xl text-muted mb-6 dark:text-slate-300 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(subtitle)}</p>`} <div class="max-w-xs sm:max-w-md m-auto flex flex-nowrap flex-col sm:flex-row sm:justify-center gap-4 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"> ${callToAction && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "primary", ...callToAction })}`} </div>`} ${callToAction2 && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction2 === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction2)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { ...callToAction2 })}`} </div>`} </div> </div> ${content && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(content)}` })}`} </div> </div> </div> </section>`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/HeroText.astro", void 0);

const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Pricing"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroText", $$HeroText, { "tagline": "Pricing", "title": "Stellar Pricing for Every Journey", "subtitle": "Choose the perfect plan that aligns with your cosmic goals." })}  ${renderComponent($$result2, "Prices", $$Pricing$1, { "title": "Our prices", "subtitle": "Only pay for what you need", "prices": [
    {
      title: "basic",
      subtitle: "Optimal choice for personal use",
      price: 29,
      period: "per month",
      items: [
        {
          description: "Etiam in libero, et volutpat"
        },
        {
          description: "Aenean ac nunc dolor tristique"
        },
        {
          description: "Cras scelerisque accumsan lib"
        },
        {
          description: "In hac habitasse"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      }
    },
    {
      title: "standard",
      subtitle: "Optimal choice for small teams",
      price: 69,
      period: "Per Month",
      items: [
        {
          description: "Proin vel laoreet"
        },
        {
          description: "Ut efficitur habitasse egestas"
        },
        {
          description: "Volutpat hac curabitur"
        },
        {
          description: "Pellentesque blandit ut nibh"
        },
        {
          description: "Donec fringilla sem"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      },
      hasRibbon: true,
      ribbonTitle: "popular"
    },
    {
      title: "premium",
      subtitle: "Optimal choice for companies",
      price: 199,
      period: "Per Month",
      items: [
        {
          description: "Curabitur suscipit risus"
        },
        {
          description: "Aliquam habitasse malesuada"
        },
        {
          description: "Suspendisse sit amet blandit"
        },
        {
          description: "Suspendisse auctor blandit dui"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      }
    }
  ] })}  ${renderComponent($$result2, "Features3", $$Features3, { "title": "Price-related features", "subtitle": "Discover the advantages of choosing our plans", "columns": 2, "items": [
    {
      title: "Tiered Pricing Plans",
      description: "Choose from a range of pricing plans designed to accommodate different budgets and requirements.",
      icon: "tabler:stairs"
    },
    {
      title: "Transparent Pricing",
      description: "Clearly displayed pricing details for each plan, with no hidden costs or unexpected charges.",
      icon: "tabler:flip-vertical"
    },
    {
      title: "Secure Payment Methods",
      description: "Secure payment gateways to protect your financial information during transactions.",
      icon: "tabler:shield-lock"
    },
    {
      title: "Instant Access",
      description: `Immediate access to your chosen plan's features and templates upon subscription.`,
      icon: "tabler:accessible"
    },
    {
      title: "Upgrade Value",
      description: "Upgrade to higher-tier plans to unlock more features and benefits for an enhanced experience.",
      icon: "tabler:chevrons-up"
    },
    {
      title: "24H support",
      description: "Questions answered via live chat, email or phone, every calendar day.",
      icon: "tabler:headset"
    }
  ], "classes": { container: "max-w-5xl" } })}  ${renderComponent($$result2, "Steps", $$Steps, { "title": "A guided journey from plans to creativity", "tagline": "simplified process", "isReversed": true, "items": [
    {
      title: "Explore plans",
      icon: "tabler:number-1"
    },
    {
      title: "Select a plan",
      icon: "tabler:number-2"
    },
    {
      title: "Sign Up / Log In",
      icon: "tabler:number-3"
    },
    {
      title: "Review order",
      icon: "tabler:number-4"
    },
    {
      title: "Enter payment details",
      icon: "tabler:number-5"
    },
    {
      title: "Confirmation",
      icon: "tabler:number-6"
    },
    {
      title: "Download and start using the template(s)",
      icon: "tabler:number-7"
    }
  ], "image": {
    src: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    alt: "Steps image"
  } })}  ${renderComponent($$result2, "FAQs", $$FAQs, { "title": "Pricing FAQs", "subtitle": "Choosing the right plan is important, and we're here to answer your questions. If you have queries about our pricing options, you're in the right place.", "columns": 1, "items": [
    {
      title: "Do the plans come with customer support?",
      description: "Absolutely, all plans include access to our dedicated customer support to assist you with any queries or concerns."
    },
    {
      title: "Is there a trial period for the different plans?",
      description: "Unfortunately, we don't offer trial periods for the plans. However, you can check out our demo section to preview the quality of our templates."
    },
    {
      title: "Can I switch between plans?",
      description: "Certainly! You can easily upgrade or downgrade your plan, at any time, to find the one that best suits your evolving requirements."
    },
    {
      title: "What payment methods do you accept?",
      description: "We accept major credit cards and online payment methods to ensure a convenient and secure transaction process."
    },
    {
      title: "Are there any hidden fees beyond the displayed cost?",
      description: "No, the subscription cost covers all the features and templates listed under each plan. There are no hidden fees or extra charges."
    }
  ] })}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Ready to boost your projects?", "subtitle": "Join our community of satisfied customers who have transformed their work with our templates.", "actions": [
    {
      variant: "primary",
      text: "Get started now",
      href: "/"
    }
  ] })} ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/pricing.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
