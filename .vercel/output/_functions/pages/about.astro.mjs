import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$Features2 } from '../chunks/Features2_Ch2_6bQP.mjs';
import { $ as $$Features3 } from '../chunks/Features3_BwHrlUEg.mjs';
import { $ as $$Hero } from '../chunks/Hero_D-WTfCG-.mjs';
import { $ as $$Stats } from '../chunks/Stats_Ckt1MlTw.mjs';
import { $ as $$Steps2 } from '../chunks/Steps2_JN0unvFW.mjs';
import { $ as $$PageLayout } from '../chunks/PageLayout_Ba0vUiqJ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const metadata = {
    title: "About us"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "tagline": "About JyotirSetu" }, { "image": ($$result3) => renderTemplate`${maybeRenderHead()}<div> <div class="relative m-auto max-w-4xl"> <img src="/src/assets/images/JyotirSetu Full Logo Transparent.png" alt="JyotirSetu Astrology Logo" class="mx-auto w-auto h-auto max-h-96 object-contain" style="max-width: 100%; height: auto;"> </div> </div>`, "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
At JyotirSetu, we bridge the timeless wisdom of Vedic astrology with today’s modern world. 
      Our mission is simple—help individuals find clarity, purpose, and peace by understanding the 
      unique patterns of their stars. With years of experience and thousands of consultations worldwide, 
      we remain committed to ethical, compassionate, and empowering guidance.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Guiding Lives Through <br> <span class="text-accent dark:text-white"> Authentic Vedic Astrology</span> ` })}` })}  <section class="px-4 py-16 mx-auto max-w-7xl lg:py-20"> <div class="text-center"> <h2 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
Ready to Begin Your Journey?
</h2> <p class="mt-4 text-xl text-gray-600 dark:text-slate-400">
Book your consultation with our expert astrologer and discover the guidance you need.
</p> <div class="mt-8"> <a href="/ScheduleAppointmentJyotirSetu" class="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>
Book your Appointment
</a> </div> </div> </section>  ${renderComponent($$result2, "Stats", $$Stats, { "title": "JyotirSetu in Numbers", "stats": [
    { title: "Client Satisfaction", amount: "98%" },
    { title: "Countries Served", amount: "9" },
    { title: "Lives Impacted", amount: "18000+" },
    { title: "Average Rating", amount: "4.9/5" }
  ] })}  ${renderComponent($$result2, "Features3", $$Features3, { "title": "Our Core Services", "subtitle": "We offer personalized astrological solutions designed to align your life with cosmic harmony.", "columns": 3, "isBeforeContent": true, "items": [
    {
      title: "Kundli Analysis",
      description: "Discover your true potential with detailed birth chart readings that reveal strengths, challenges, and life path.",
      icon: "tabler:sun"
    },
    {
      title: "Dosha Remedies",
      description: "Effective solutions for Mangal Dosha, Kaal Sarp Dosha, Pitru Dosha, and more\u2014bringing balance and relief.",
      icon: "tabler:stars"
    },
    {
      title: "Matchmaking (Kundli Milan)",
      description: "Astrology-backed compatibility insights to strengthen relationships and ensure lasting harmony.",
      icon: "tabler:heart"
    }
  ] })}  ${renderComponent($$result2, "Features3", $$Features3, { "columns": 3, "isAfterContent": true, "items": [
    {
      title: "Gemstone Consultation",
      description: "Select gemstones aligned with your planetary positions to enhance positive energies in life.",
      icon: "tabler:diamond"
    },
    {
      title: "Career & Finance Guidance",
      description: "Make informed decisions by aligning career and wealth goals with favorable planetary periods.",
      icon: "tabler:briefcase"
    },
    {
      title: "Spiritual Healing",
      description: "Mantra, yantra, and meditative practices tailored to your chart for deeper spiritual growth.",
      icon: "tabler:yin-yang"
    }
  ], "image": {
    src: "https://media.istockphoto.com/id/2157137073/photo/illuminated-zodiac-signs.webp?a=1&b=1&s=612x612&w=0&k=20&c=8wy0rJL12eAttmwNQnkHx8OWpIMAmm4wQJ_K5y6Ia6o=",
    alt: "Astrology Consultation"
  } })}  ${renderComponent($$result2, "Steps2", $$Steps2, { "title": "Our Values", "subtitle": "Astrology is not about fate\u2014it\u2019s about empowerment. We follow these guiding principles:", "items": [
    {
      title: "Client-Centered Approach",
      description: "Every reading is delivered with compassion and confidentiality, ensuring a safe and supportive experience."
    },
    {
      title: "Authenticity & Ethics",
      description: "We stay true to classical Vedic astrology practices while avoiding fear-based predictions."
    },
    {
      title: "Continuous Learning",
      description: "Our astrologers stay updated with research, ensuring modern relevance of ancient wisdom."
    }
  ] })}  ${renderComponent($$result2, "Features2", $$Features2, { "title": "Our Approach", "tagline": "The JyotirSetu Method", "columns": 4, "items": [
    {
      title: "Listen",
      description: "Understanding your questions deeply."
    },
    {
      title: "Analyze",
      description: "Studying your birth chart and planetary positions."
    },
    {
      title: "Guide",
      description: "Offering remedies and practical advice."
    },
    {
      title: "Support",
      description: "Being there whenever you need cosmic guidance."
    }
  ] })}  ${renderComponent($$result2, "Steps2", $$Steps2, { "title": "Achievements", "subtitle": "Proud milestones that reflect our journey in guiding thousands of lives.", "isReversed": true, "callToAction": {
    text: "See Testimonials",
    href: "/testimonials"
  }, "items": [
    {
      title: "Global Reach",
      description: "Consultations delivered to clients across more than 50 countries worldwide.",
      icon: "tabler:globe"
    },
    {
      title: "Trusted by Thousands",
      description: "Over 12,000 personalized Kundli readings with consistent positive feedback and life-changing impact.",
      icon: "tabler:message-star"
    },
    {
      title: "Recognized Experts",
      description: "Featured in spiritual forums and recognized by clients as a trusted authority in astrology.",
      icon: "tabler:award"
    }
  ] })}  <section class="px-4 py-16 mx-auto max-w-7xl lg:py-20"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
Connect with Us
</h2> <p class="mt-4 text-xl text-gray-600 dark:text-slate-400">
We are here to guide you
</p> </div> <div class="grid gap-8 sm:grid-cols-2"> <!-- WhatsApp/Call Card --> <div class="group cursor-pointer"> <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20would%20like%20to%20know%20more%20about%20your%20astrology%20services.%20My%20details:%20Name:%20DOB:%20Time:%20Place:" target="_blank" rel="noopener noreferrer" class="block rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur border border-[#ffffff29] bg-white dark:bg-slate-900 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"> <div class="flex items-center mb-4"> <svg class="w-12 h-12 text-primary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> <h3 class="text-xl font-bold text-gray-900 dark:text-white">📱 WhatsApp or Call</h3> </div> <p class="text-muted">
Connect with us at <strong>+91 9266991298</strong><br>
Available on <strong>WhatsApp & Calls</strong> from<br>
9 AM – 9 PM IST<br>
For faster response, WhatsApp your Name, DOB (DD-MM-YYYY), Time, Place.
</p> </a> </div> <!-- Email Card --> <div class="group cursor-pointer"> <a href="mailto:ask@jyotirsetu.com?subject=Astrology%20Consultation%20Inquiry&body=Hello%20JyotirSetu,%0A%0AI%20would%20like%20to%20schedule%20an%20astrology%20consultation.%0A%0AMy%20details:%0AName:%0ADate%20of%20Birth:%0ABirth%20Time:%0ABirth%20Place:%0A%0AThank%20you!" class="block rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur border border-[#ffffff29] bg-white dark:bg-slate-900 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"> <div class="flex items-center mb-4"> <svg class="w-12 h-12 text-primary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> <h3 class="text-xl font-bold text-gray-900 dark:text-white">📧 Email Us</h3> </div> <p class="text-muted">
Reach us at <strong>ask@jyotirsetu.com</strong><br>
Send us your inquiry and we'll get back to you within 24 hours.
</p> </a> </div> </div> </section> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/about.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
