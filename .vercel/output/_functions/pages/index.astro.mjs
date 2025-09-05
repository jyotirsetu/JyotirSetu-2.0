import { d as createAstro, c as createComponent, e as renderScript, m as maybeRenderHead, a as renderTemplate, r as renderComponent, u as unescapeHTML, F as Fragment } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { c as $$Icon, $ as $$PageLayout } from '../chunks/PageLayout_DOxrouzY.mjs';
import { $ as $$Hero } from '../chunks/Hero_C3KDcd_U.mjs';
import 'clsx';
import { $ as $$Features } from '../chunks/Features_BX2CM3Nc.mjs';
import { $ as $$Features2 } from '../chunks/Features2_DuwqElg0.mjs';
import { $ as $$Steps } from '../chunks/Steps_CYgLAREM.mjs';
import { $ as $$Content } from '../chunks/Content_Cyqr6q9b.mjs';
import { $ as $$FAQs } from '../chunks/FAQs_CFasQuS3.mjs';
import { $ as $$Stats } from '../chunks/Stats_Vxzi6yof.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_CFc8aS-w.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro("https://jyotirsetu.com");
const $$DailyAstroTip = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DailyAstroTip;
  return renderTemplate`${renderScript($$result, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/DailyAstroTip.astro?astro&type=script&index=0&lang.ts")} <!-- Daily Astro Tip Widget -->${maybeRenderHead()}<section class="daily-astro-tip bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 py-6 sm:py-8 border-b border-purple-200 dark:border-purple-700"> <div class="max-w-6xl mx-auto px-4 sm:px-6"> <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 border border-purple-200 dark:border-slate-700"> <!-- Mobile Layout: Stacked --> <div class="block sm:hidden"> <!-- Category and Title Row --> <div class="flex items-center justify-between mb-3"> <span class="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full" id="daily-tip-category">
Nakshatra
</span> <span class="text-xs text-gray-500 dark:text-gray-400">
🌟 Daily Cosmic Insight
</span> </div> <!-- Tip Text --> <p class="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-4" id="daily-tip-text">
🌌 Moon in Rohini Nakshatra—ideal for creativity & nurturing connections.
</p> <!-- Buttons Stacked --> <div class="space-y-3"> <button onclick="window.location.href='/ScheduleAppointmentJyotirSetu'" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-3 rounded-lg transition-colors duration-200 text-sm">
Book Consultation
</button> <a href="/#path-to-clarity" class="w-full text-center block text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors duration-200 px-4 py-3 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200">
Learn More
</a> </div> </div> <!-- Desktop Layout: Side by Side --> <div class="hidden sm:flex items-center justify-between"> <div class="flex-1"> <div class="flex items-center space-x-3 mb-2"> <span class="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full" id="daily-tip-category">
Nakshatra
</span> <span class="text-xs text-gray-500 dark:text-gray-400">
🌟 Daily Cosmic Insight
</span> </div> <p class="text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed" id="daily-tip-text">
🌌 Moon in Rohini Nakshatra—ideal for creativity & nurturing connections.
</p> </div> <div class="flex items-center space-x-3 ml-6"> <button onclick="window.location.href='/ScheduleAppointmentJyotirSetu'" class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
Book Consultation
</button> <a href="/#path-to-clarity" class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors duration-200 px-4 py-2 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200">
Learn More
</a> </div> </div> </div> </div> </section>`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/DailyAstroTip.astro", void 0);

const $$DailyTipsDisplay = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="daily-tips-section bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Section Header --> <div class="text-center mb-12"> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
✨ Daily Cosmic Insights
</h2> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
Discover today's spiritual guidance and cosmic wisdom to illuminate your path
</p> </div> <!-- Tips Container --> <div id="daily-tips-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Loading State --> <div class="col-span-full text-center py-12"> <div class="inline-flex items-center space-x-2"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div> <span class="text-gray-600 dark:text-gray-400">Loading cosmic insights...</span> </div> </div> </div> <!-- No Tips State (hidden by default) --> <div id="no-tips-state" class="hidden text-center py-12"> <div class="text-gray-500 dark:text-gray-400"> <span class="text-6xl block mb-4">🌟</span> <p class="text-lg">No cosmic insights available yet</p> <p class="text-sm mt-2">Check back soon for daily wisdom</p> </div> </div> </div> </div> <!-- Supabase Client Script --> ${renderScript($$result, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/DailyTipsDisplay.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/DailyTipsDisplay.astro?astro&type=script&index=1&lang.ts")}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/DailyTipsDisplay.astro", void 0);

const $$Astro$2 = createAstro("https://jyotirsetu.com");
const $$Note = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Note;
  const {
    icon = "tabler:info-square",
    title = await Astro2.slots.render("title"),
    description = await Astro2.slots.render("description")
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="bg-blue-50 dark:bg-slate-800 not-prose"> <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-md text-center font-medium"> ${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "w-5 h-5 inline-block align-text-bottom font-bold" })} <span class="font-bold">${unescapeHTML(title)}</span> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(description)}` })} </div> </section>`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/Note.astro", void 0);

const $$Astro$1 = createAstro("https://jyotirsetu.com");
const $$EmailCapture = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$EmailCapture;
  return renderTemplate`${maybeRenderHead()}<div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 2rem; border-radius: 1rem; margin: 2rem 0; text-align: center;"> <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937;">🌟 Get Your Daily Astro Tip</h3> <p style="color: #6b7280; margin-bottom: 2rem;">Discover cosmic insights delivered to your inbox daily! Plus, receive your FREE Dosha Balancing Guide!</p> <!-- Ultra-Simple Formspree Form - Exactly as Formspree expects --> <form action="https://formspree.io/f/xnnbgerl" method="POST" style="max-width: 500px; margin: 0 auto;"> <div style="margin-bottom: 1rem;"> <input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; margin-bottom: 0.5rem;"> </div> <div style="margin-bottom: 1rem;"> <input type="email" name="email" placeholder="Your Email" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; margin-bottom: 0.5rem;"> </div> <!-- Hidden fields for tracking --> <input type="hidden" name="source" value="homepage_email_capture"> <input type="hidden" name="type" value="daily_astro_tip"> <button type="submit" style="width: 100%; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">
Get Free Guide & Daily Tips
</button> <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">We respect your privacy. Unsubscribe at any time.</p> </form> </div>`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/EmailCapture.astro", void 0);

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const metadata = {
    title: "JyotirSetu",
    ignoreTitleTemplate: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Book your Appointment",
      href: "/ScheduleAppointmentJyotirSetu",
      icon: "tabler:calendar"
    },
    { text: "Learn more", href: "#features" }
  ], "image": { src: "~/assets/images/2hero-image.png", alt: "JyotirSetu Hero Image" } }, { "subtitle": ($$result3) => renderTemplate`${maybeRenderHead()}<div> <span class="font-semibold">At JyotirSetu,</span> we offer expert guidance in Vedic Astrology, Palmistry, and Numerology — helping you gain deeper clarity, direction, and peace of mind in life's journey.
</div>`, "title": ($$result3) => renderTemplate`<div>
JyotirSetu<span class="hidden xl:inline"></span> <span class="text-accent dark:text-white"> Astrology</span> </div>` })}  ${renderComponent($$result2, "DailyAstroTip", $$DailyAstroTip, {})}  ${renderComponent($$result2, "DailyTipsDisplay", $$DailyTipsDisplay, {})}  ${renderComponent($$result2, "Note", $$Note, { "title": "\u2728 Bridge to Cosmic Clarity \u2728", "description": "Guiding your journey through Vedic Astrology, Palmistry & Numerology" })}  ${renderComponent($$result2, "Features", $$Features, { "id": "features", "tagline": "Why Choose", "title": "JyotirSetu ?", "subtitle": "Trusted advisory in Astrology, Palmistry, and Numerology \u2014 offering structured, reliable, and insightful consultations tailored to your life\u2019s unique journey.", "items": [
    {
      title: "Personalized Consultations",
      description: "Every session is unique, based on your individual birth chart, palmistry lines, and numerological profile.",
      icon: "tabler:sparkles"
    },
    {
      title: "Holistic Guidance",
      description: "We combine Astrology, Palmistry, and Numerology for a 360\xB0 view of your life\u2019s journey.",
      icon: "flat-color-icons:gallery"
    },
    {
      title: "Authentic Vedic Knowledge",
      description: "Rooted in over 25+ years of experience, ensuring genuine and reliable insights.",
      icon: "flat-color-icons:approval"
    },
    {
      title: "Clarity & Peace of Mind",
      description: "Our consultations focus on removing confusion and guiding you with confidence.",
      icon: "flat-color-icons:document"
    },
    {
      title: "Trust & Transparency",
      description: "No fear-based predictions \u2014 only clear, compassionate, and solution-oriented advice.",
      icon: "flat-color-icons:advertising"
    },
    {
      title: "Convenient & Accessible",
      description: "Book appointments easily online, with flexible options for in-person or virtual sessions.",
      icon: "flat-color-icons:currency-exchange"
    }
  ] })} ${renderComponent($$result2, "Content", $$Content, { "id": "meet-our-expert", "isReversed": true, "tagline": " ", "title": "Meet Our Expert", "items": [
    {
      title: "",
      description: "Certified Astrologer \u2013 Bharatiya Vidya Bhavan",
      icon: "tabler:certificate"
    },
    {
      title: "",
      description: "Diploma in Palmistry \u2013 Indian Council of Astrological Sciences (ICAS)",
      icon: "tabler:certificate"
    },
    {
      title: "",
      description: "Certified Numerologist \u2013 All India Federation of Astrologers' Societies (AIFAS)",
      icon: "tabler:numbers"
    },
    {
      title: "",
      description: "Life Member \u2013 Astrological Research Project, Kolkata",
      icon: "tabler:certificate"
    },
    {
      title: "\u2728 Trusted by clients across India and abroad for accurate, insightful, and result-oriented guidance.",
      description: "",
      icon: "tabler:users"
    }
  ], "image": {
    src: "https://images.unsplash.com/photo-1704927768403-eea484c47783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEFzdHJvbG9nZXIlMjBwZXJzb258ZW58MHwxfDB8fHwy",
    alt: "Colorful Image"
  } }, { "bg": ($$result3) => renderTemplate`<div> <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> </div>`, "content": ($$result3) => renderTemplate`<div> <h3 class="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl mb-2">🌟Our Astrologer – Punita Sharma</h3>
With over 25 years of expertise in Astrology, Palmistry & Numerology, Punita Sharma (M.A. Sanskrit) has guided thousands of clients with accurate predictions and practical remedies. Her deep knowledge, compassionate approach, and professional ethics make her one of the most trusted names in the field.
</div>` })}  ${renderComponent($$result2, "Features2", $$Features2, { "id": "services", "title": "\u{1F52E} Our Most Trusted Astrology Services", "subtitle": "Guiding you through life's journey with clarity and cosmic wisdom.", "tagline": "Our Services", "items": [
    {
      title: "Kundli Analysis",
      description: "\u{1F4DC} Unlock the secrets of your birth chart to understand your true path and purpose.",
      icon: "flat-color-icons:template",
      href: "/services/kundli-analysis"
    },
    {
      title: "Palmistry",
      description: "\u270B Discover your destiny written in the lines of your hands.",
      icon: "flat-color-icons:gallery",
      href: "/services/palmistry"
    },
    {
      title: "Matchmaking (Kundli Milan)",
      description: "\u2764\uFE0F Ensure a harmonious and compatible relationship with astrological insights.",
      icon: "flat-color-icons:approval",
      href: "/services/matchmaking"
    },
    {
      title: "Numerology",
      description: "\u{1F522} Decode the hidden meaning of numbers influencing your life.",
      icon: "flat-color-icons:document",
      href: "/services/numerology"
    },
    {
      title: "Gemstone Consultation",
      description: "\u{1F48E} Find the right gemstone to balance energies and attract positivity.",
      icon: "flat-color-icons:advertising",
      href: "/services/gemstone-consultation"
    },
    {
      title: "Career & Finance Guidance",
      description: "\u{1F4BC} Navigate your professional and financial journey with astrology.",
      icon: "flat-color-icons:currency-exchange",
      href: "/services/career-finance"
    },
    {
      title: "Spiritual Guidance",
      description: "\u{1F30C} Connect with your higher self through cosmic wisdom and meditation.",
      icon: "flat-color-icons:voice-presentation",
      href: "/services/spiritual-guidance"
    },
    {
      title: "Remedial Solutions",
      description: "\u{1F52E} Simple yet powerful remedies for peace, prosperity, and well-being.",
      icon: "flat-color-icons:business-contact",
      href: "/services/remedial-solutions"
    },
    {
      title: "Dosha Analysis & Remedies",
      description: "\u{1F311} Identify Mangal Dosha, Kaal Sarp Dosha, Pitru Dosha and more, with effective astrological solutions.",
      icon: "flat-color-icons:database",
      href: "/services/dosha-analysis"
    }
  ] }, { "bg": ($$result3) => renderTemplate`<div> <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> </div>` })}  ${renderComponent($$result2, "Content", $$Content, { "isReversed": true, "tagline": "Ancient Wisdom, Modern Solutions", "title": "JyotirSetu\u2019s Blueprint: Ancient Wisdom for Modern Living", "items": [
    {
      title: "\u{1F319} Rooted in Vedic Astrology",
      description: "Authentic insights drawn from ancient scriptures, ensuring accuracy and trust."
    },
    {
      title: "\u270B Palmistry with Precision",
      description: "Revealing hidden patterns of destiny through detailed hand analysis."
    },
    {
      title: "\u{1F522} Numerology for Life Balance",
      description: "Decoding the power of numbers to bring harmony in personal and professional life."
    }
  ], "image": {
    src: "https://nypost.com/wp-content/uploads/sites/2/2022/03/vedic-astrology-1.jpg?quality=75&strip=all&w=1024",
    alt: "Colorful Image"
  } }, { "bg": ($$result3) => renderTemplate`<div> <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> </div>`, "content": ($$result3) => renderTemplate`<div> <h3 class="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl mb-2">Building on modern foundations</h3>
Gain a competitive advantage by incorporating industry leading practices
</div>` })}  ${renderComponent($$result2, "Content", $$Content, { "isAfterContent": true, "items": [
    {
      title: "\u2B50 Personalized Consultations",
      description: `Tailored sessions that resonate with your unique birth chart and life circumstances.`
    },
    {
      title: "\u{1F549} Holistic Approach",
      description: "Combining astrology, palmistry, and numerology for a complete understanding."
    },
    {
      title: "\u{1F30D} Global Reach",
      description: "Available online and offline \u2014 making expert guidance accessible anywhere."
    },
    {
      title: "\u{1F52E} Practical Remedies",
      description: "Simple, effective, and result-driven solutions for harmony and growth."
    }
  ], "image": {
    src: "https://media.istockphoto.com/id/1125303928/photo/magic-figures-destiny-in-hands.webp?a=1&b=1&s=612x612&w=0&k=20&c=Fhd8QMhqBmj45x1ieB6KgltMArci9rkxKyGQ8ZuPxJA=",
    alt: "Blueprint Image"
  } }, { "bg": ($$result3) => renderTemplate`<div> <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> </div>`, "content": ($$result3) => renderTemplate`<div>Ensure your guidance truly empowers you.</div>` })}  ${renderComponent($$result2, "Content", $$Content, { "isReversed": true, "isAfterContent": true, "items": [
    {
      title: "\u{1F31F} Deeper Clarity in Life",
      description: "Understand your purpose, strengths, and opportunities."
    },
    {
      title: "\u{1F4AB} Guidance for Growth",
      description: "Practical direction for relationships, career, health, and finance."
    },
    {
      title: "\u{1F514} Continuous Support",
      description: "Stay aligned with cosmic changes through ongoing guidance and sessions."
    },
    {
      title: "\u{1F91D} Trusted Expertise",
      description: `25+ Years of experience and hundreds of satisfied clients across India and abroad.`
    }
  ], "image": {
    src: "https://images.unsplash.com/photo-1615829676042-f8f0a12315b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGdsb3dpbmclMjBwYXRoJTIwYXN0cm9sb2d5fGVufDB8MnwwfHx8Mg%3D%3D",
    alt: "Astronauts Image"
  } }, { "bg": ($$result3) => renderTemplate`<div> <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> </div>`, "content": ($$result3) => renderTemplate`<div>Designed to Transform Your Journey.</div>` })}  ${renderComponent($$result2, "Steps", $$Steps, { "id": "path-to-clarity", "title": "Your Path to Clarity with JyotirSetu", "items": [
    {
      title: 'Step 1: <span class="font-medium">Book Your Consultation</span>',
      description: "Select the service that resonates with you \u2014 whether Vedic Astrology, Palmistry, or Numerology. Scheduling is simple and tailored to your convenience.",
      icon: "tabler:calendar-check"
    },
    {
      title: 'Step 2: <span class="font-medium">Share Your Details</span>',
      description: "Provide the necessary information like birth date, time, and place (for astrology) or a palm image (for palmistry). Accuracy here ensures deep, personalized insights.",
      icon: "tabler:id"
    },
    {
      title: 'Step 3: <span class="font-medium">Receive Expert Guidance</span>',
      description: "Our experienced astrologers and consultants prepare a detailed reading, offering practical solutions and spiritual clarity that align with your life's journey.",
      icon: "tabler:stars"
    },
    {
      title: "Transform with Clarity!",
      description: "Walk away with peace of mind, clear direction, and remedies that help you overcome challenges and unlock your true potential.",
      icon: "tabler:sun"
    }
  ], "image": {
    src: "https://media.istockphoto.com/id/2192271334/photo/woman-watching-virtual-meditation-class-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=ekYc2FRzpWiAZYDzUnPz9AY-rNum66FE4lJeXeIN-WA=",
    alt: "Steps image"
  } })}  <section class="px-4 py-16 mx-auto max-w-7xl lg:py-20"> <div class="text-center"> <div class="flex justify-center mb-8"> <a href="/ScheduleAppointmentJyotirSetu" class="inline-flex items-center justify-center w-full px-8 py-4 text-base font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 border border-transparent rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>
Book Your Appointment
</a> </div> </div> </section>  <section class="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"> <div class="max-w-7xl mx-auto px-6"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-heading mb-4">🌟 Stay Connected with Cosmic Wisdom</h2> <p class="text-lg text-muted">Get weekly insights, remedies, and cosmic guidance delivered to your inbox</p> </div> ${renderComponent($$result2, "EmailCapture", $$EmailCapture, {})} </div> </section>  ${renderComponent($$result2, "FAQs", $$FAQs, { "id": "faqs", "title": "Frequently Asked Questions", "subtitle": "Dive into the following questions to gain insights into the powerful features that AstroWind offers and how it can elevate your web development journey.", "tagline": "FAQs", "classes": { container: "max-w-6xl" }, "items": [
    {
      title: "What information do I need to provide for a precise Kundli reading?",
      description: "To ensure accuracy, please share your exact date, time, and place of birth. Even small discrepancies can affect the birth chart\u2019s interpretation and timing of insights."
    },
    {
      title: "How does Jyotish (Vedic astrology) differ from Western astrology?",
      description: "Jyotish is based on the sidereal zodiac, focusing on the moon sign and nakshatras, rather than the sun sign. Its core lies in timing via dashas and planetary periods, believed to offer deeper, culturally anchored insights."
    },
    {
      title: "What types of readings and services do you offer?",
      description: "We provide Kundli Analysis, Dosha Identification & Remedies, Matchmaking (Kundli Milan), Gemstone Consultation, Numerology, Career & Finance Insights, Palmistry, Spiritual Guidance, and more."
    },
    {
      title: "Why consult JyotirSetu for your astrology needs?",
      description: "Our experienced astrologers offer personalized guidance using chart-specific insights, practical remedies, and spiritual counseling\u2014helping you make informed decisions rather than vague predictions."
    },
    {
      title: "Can astrology predict the future with certainty?",
      description: "Astrology highlights patterns and potential timings\u2014yes\u2014but doesn\u2019t override free will. It\u2019s a guiding tool, not a deterministic script."
    },
    {
      title: "What is a Dosha, and how can you help?",
      description: "Doshas\u2014like Mangal, Kaal Sarp, and Pitru Dosha\u2014are imbalances in your planetary configuration. JyotirSetu analyzes these and offers tailored, practical remedies aligned with Vedic tradition."
    },
    {
      title: "How do gemstones work in astrology?",
      description: "Gemstones act as vibrational amplifiers to strengthen planetary energies. We suggest precise gems after chart analysis to enhance balance and well-being."
    },
    {
      title: "How can astrology support my career and financial decisions?",
      description: "By examining relevant houses and planetary placements, we provide clarity on strengths, timing, and optimal paths\u2014helping you navigate professional and financial transitions with confidence."
    },
    {
      title: "I don\u2019t know my exact birth time. Can I still get insights?",
      description: "Partial readings are possible, but accuracy improves exponentially with a precise birth time. Astrologers may use rectification techniques to estimate your correct chart when needed."
    },
    {
      title: "What benefits do I gain from a consultation with JyotirSetu?",
      description: "You\u2019ll receive clarity, greater self-awareness, timing guidance, and actionable solutions\u2014helping you align with your life\u2019s purpose and cosmic rhythm."
    },
    {
      title: "How secure and private are your consultations and data?",
      description: "We uphold full confidentiality. Discussions are private, and personal details remain encrypted and are accessible only to your astrologer."
    },
    {
      title: "How do I book, and what is the process?",
      description: "Booking is simple: choose your consultation type, fill in your birth details, schedule your slot, and you\u2019ll receive confirmation with all required instructions."
    },
    {
      title: "Are the remedies and guidance you offer safe and practical?",
      description: "Yes\u2014our suggested remedies are grounded in classical texts and designed to be practical, easy to follow, and safe for daily use."
    }
  ] })}  ${renderComponent($$result2, "Stats", $$Stats, { "stats": [
    { title: "Kundlis Analyzed", amount: "12000+" },
    { title: "Doshas Identified & Resolved", amount: "4500+" },
    { title: "Gemstone Consultations", amount: "3000+" },
    { title: "Years of Expertise", amount: "25+" },
    { title: "Trusted Visitors", amount: "95487", id: "trusted-visitors" }
  ] })} ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/index.astro?astro&type=script&index=0&lang.ts")}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [
    {
      variant: "primary",
      text: "Book your Appointment",
      href: "/ScheduleAppointmentJyotirSetu",
      icon: "tabler:calendar"
    }
  ] }, { "subtitle": ($$result3) => renderTemplate`<div>
JyotirSetu – Bridging Cosmic Light with Modern Guidance. Authentic Vedic Astrology consultations to illuminate your path.<br class="hidden md:inline">Don't
      waste more time!
</div>`, "title": ($$result3) => renderTemplate`<div>
About JyotirSetu<br class="block sm:hidden"><span class="sm:whitespace-nowrap"></span> </div>` })} ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/index.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
