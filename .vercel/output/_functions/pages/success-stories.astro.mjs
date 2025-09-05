import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, e as renderScript, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../chunks/PageLayout_cVV0aLge.mjs';
import { $ as $$Hero } from '../chunks/Hero_BF_jfkyY.mjs';
/* empty css                                           */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://jyotirsetu.com");
const $$SuccessStories = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SuccessStories;
  const metadata = {
    title: "Success Stories & Case Studies - JyotirSetu",
    description: "See how JyotirSetu guided individuals to clarity, balance, and success. Real anonymized client journeys and transformation stories."
  };
  const successStories = [
    {
      id: 1,
      name: "Priya S.",
      age: 28,
      service: "Career Guidance",
      problem: "Struggling with career direction and job satisfaction",
      solution: "Comprehensive birth chart analysis revealed strong leadership qualities and entrepreneurial potential",
      outcome: "Started successful consulting business, 3x income increase, found true passion",
      testimonial: "JyotirSetu helped me discover my true calling. The career guidance was spot-on and gave me the confidence to start my own business.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N8ZW58MHwyfDB8fHwy",
      category: "career"
    },
    {
      id: 2,
      name: "Rajesh M.",
      age: 35,
      service: "Relationship Compatibility",
      problem: "Multiple failed relationships, difficulty finding compatible partner",
      solution: "Detailed compatibility analysis and personalized relationship guidance",
      outcome: "Found compatible partner, married within 1 year, now happily married for 3 years",
      testimonial: "The relationship compatibility analysis was incredibly accurate. I finally found someone who truly understands me.",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291cGxlfGVufDB8MnwwfHx8Mg%3D%3D",
      category: "relationship"
    },
    {
      id: 3,
      name: "Anita K.",
      age: 42,
      service: "Health Astrology",
      problem: "Chronic health issues, low energy, stress-related problems",
      solution: "Dosha analysis and personalized health remedies including gemstone therapy",
      outcome: "Significant improvement in energy levels, better sleep, reduced stress, overall health transformation",
      testimonial: "The health remedies changed my life. I feel more energetic and balanced than ever before.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYXxlbnwwfDJ8MHx8fDI%3D",
      category: "health"
    },
    {
      id: 4,
      name: "Vikram P.",
      age: 31,
      service: "Numerology Consultation",
      problem: "Career stagnation, lack of motivation, unclear life purpose",
      solution: "Life Path Number analysis and personalized numerology guidance",
      outcome: "Career breakthrough, new job with 40% salary increase, renewed sense of purpose",
      testimonial: "The numerology consultation revealed my hidden potential. I now have a clear direction and renewed motivation.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsfGVufDB8MnwwfHx8Mg%3D%3D",
      category: "career"
    },
    {
      id: 5,
      name: "Meera R.",
      age: 26,
      service: "Gemstone Consultation",
      problem: "Lack of confidence, communication issues, social anxiety",
      solution: "Personalized gemstone recommendations and wearing guidance",
      outcome: "Improved confidence, better communication skills, reduced social anxiety, career advancement",
      testimonial: "Wearing the recommended gemstones has transformed my confidence. I feel more powerful and capable now.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2Vtc3RvbmVzfGVufDB8MnwwfHx8Mg%3D%3D",
      category: "personal"
    },
    {
      id: 6,
      name: "Arjun S.",
      age: 38,
      service: "Palmistry Reading",
      problem: "Financial difficulties, poor investment decisions, lack of wealth consciousness",
      solution: "Palm reading analysis focusing on wealth lines and financial guidance",
      outcome: "Better financial decisions, started successful investments, improved wealth consciousness",
      testimonial: "The palmistry reading opened my eyes to my financial potential. I've made much better investment decisions since.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZHN8ZW58MHwyfDB8fHwy",
      category: "finance"
    }
  ];
  const categories = ["All", "Career", "Relationship", "Health", "Personal", "Finance"];
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata, "data-astro-cid-to23xn4u": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "title": "\u{1F31F} Success Stories & Case Studies", "subtitle": "See how JyotirSetu guided individuals to clarity, balance, and success. Real anonymized client journeys and transformation stories.", "actions": [
    {
      variant: "primary",
      text: "Book Your Consultation",
      href: "/ScheduleAppointmentJyotirSetu",
      icon: "tabler:calendar"
    },
    { text: "Read Stories", href: "#stories" }
  ], "image": { src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VjY2Vzc3xlbnwwfDJ8MHx8fDI%3D", alt: "Success Stories" }, "data-astro-cid-to23xn4u": true }, { "title": ($$result3) => renderTemplate`${maybeRenderHead()}<div data-astro-cid-to23xn4u>
🌟 <span class="text-accent dark:text-white" data-astro-cid-to23xn4u>Success Stories</span> & Case Studies
</div>` })}  <section class="py-8 bg-page border-b border-gray-200 dark:border-slate-700" data-astro-cid-to23xn4u> <div class="max-w-7xl mx-auto px-6" data-astro-cid-to23xn4u> <div class="flex flex-wrap justify-center gap-3" data-astro-cid-to23xn4u> ${categories.map((category) => renderTemplate`<button class="story-filter px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"${addAttribute(category === "All" ? "all" : category.toLowerCase(), "data-category")}${addAttribute(category === "All" ? "true" : "false", "data-active")} data-astro-cid-to23xn4u> ${category} </button>`)} </div> </div> </section>  <section id="stories" class="py-16 bg-page" data-astro-cid-to23xn4u> <div class="max-w-7xl mx-auto px-6" data-astro-cid-to23xn4u> <div class="text-center mb-12" data-astro-cid-to23xn4u> <h2 class="text-3xl font-bold text-heading mb-4" data-astro-cid-to23xn4u>Real Transformations, Real Results</h2> <p class="text-lg text-muted" data-astro-cid-to23xn4u>Discover how our clients found clarity, balance, and success through JyotirSetu's guidance</p> </div> <div class="grid lg:grid-cols-2 gap-8" id="stories-grid" data-astro-cid-to23xn4u> ${successStories.map((story) => renderTemplate`<article class="story-card bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"${addAttribute(story.category, "data-category")} data-astro-cid-to23xn4u> <div class="lg:flex" data-astro-cid-to23xn4u> <div class="lg:w-1/3" data-astro-cid-to23xn4u> <img${addAttribute(story.image, "src")}${addAttribute(story.name, "alt")} class="w-full h-48 lg:h-full object-cover" data-astro-cid-to23xn4u> </div> <div class="lg:w-2/3 p-6" data-astro-cid-to23xn4u> <div class="flex items-center justify-between mb-3" data-astro-cid-to23xn4u> <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium" data-astro-cid-to23xn4u> ${story.service} </span> <span class="text-sm text-muted" data-astro-cid-to23xn4u>${story.age} years</span> </div> <h3 class="text-xl font-bold text-heading mb-3" data-astro-cid-to23xn4u>${story.name}</h3> <div class="space-y-3 mb-4" data-astro-cid-to23xn4u> <div data-astro-cid-to23xn4u> <h4 class="font-semibold text-heading text-sm mb-1" data-astro-cid-to23xn4u>🎯 Problem:</h4> <p class="text-muted text-sm" data-astro-cid-to23xn4u>${story.problem}</p> </div> <div data-astro-cid-to23xn4u> <h4 class="font-semibold text-heading text-sm mb-1" data-astro-cid-to23xn4u>💡 Solution:</h4> <p class="text-muted text-sm" data-astro-cid-to23xn4u>${story.solution}</p> </div> <div data-astro-cid-to23xn4u> <h4 class="font-semibold text-heading text-sm mb-1" data-astro-cid-to23xn4u>✨ Outcome:</h4> <p class="text-muted text-sm" data-astro-cid-to23xn4u>${story.outcome}</p> </div> </div> <blockquote class="italic text-gray-600 dark:text-gray-300 text-sm border-l-4 border-primary pl-4 mb-4" data-astro-cid-to23xn4u>
"${story.testimonial}"
</blockquote> <button class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200" data-astro-cid-to23xn4u>
Read Full Story
</button> </div> </div> </article>`)} </div> <!-- Load More Button --> <div class="text-center mt-12" data-astro-cid-to23xn4u> <button class="bg-secondary hover:bg-secondary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200" data-astro-cid-to23xn4u>
Load More Stories
</button> </div> </div> </section>  <section class="py-16 bg-gradient-to-r from-primary/5 to-secondary/5" data-astro-cid-to23xn4u> <div class="max-w-7xl mx-auto px-6" data-astro-cid-to23xn4u> <div class="text-center mb-12" data-astro-cid-to23xn4u> <h2 class="text-3xl font-bold text-heading mb-4" data-astro-cid-to23xn4u>Our Impact in Numbers</h2> <p class="text-lg text-muted" data-astro-cid-to23xn4u>Real results from real people who trusted JyotirSetu</p> </div> <div class="grid md:grid-cols-4 gap-8" data-astro-cid-to23xn4u> <div class="text-center" data-astro-cid-to23xn4u> <div class="text-4xl font-bold text-primary mb-2" data-astro-cid-to23xn4u>500+</div> <p class="text-muted" data-astro-cid-to23xn4u>Happy Clients</p> </div> <div class="text-center" data-astro-cid-to23xn4u> <div class="text-4xl font-bold text-secondary mb-2" data-astro-cid-to23xn4u>95%</div> <p class="text-muted" data-astro-cid-to23xn4u>Success Rate</p> </div> <div class="text-center" data-astro-cid-to23xn4u> <div class="text-4xl font-bold text-accent mb-2" data-astro-cid-to23xn4u>1000+</div> <p class="text-muted" data-astro-cid-to23xn4u>Consultations</p> </div> <div class="text-center" data-astro-cid-to23xn4u> <div class="text-4xl font-bold text-primary mb-2" data-astro-cid-to23xn4u>4.9/5</div> <p class="text-muted" data-astro-cid-to23xn4u>Client Rating</p> </div> </div> </div> </section>  <section class="py-16 bg-page" data-astro-cid-to23xn4u> <div class="max-w-4xl mx-auto px-6 text-center" data-astro-cid-to23xn4u> <h2 class="text-3xl font-bold text-heading mb-4" data-astro-cid-to23xn4u>Ready to Write Your Success Story?</h2> <p class="text-lg text-muted mb-8" data-astro-cid-to23xn4u>Join hundreds of satisfied clients who found clarity and success through JyotirSetu's guidance</p> <div class="space-y-4" data-astro-cid-to23xn4u> <a href="/ScheduleAppointmentJyotirSetu" class="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200" data-astro-cid-to23xn4u>
Book Your Consultation
</a> <p class="text-sm text-muted" data-astro-cid-to23xn4u>Start your transformation journey today</p> </div> </div> </section>  ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/success-stories.astro?astro&type=script&index=0&lang.ts")}  ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/success-stories.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/success-stories.astro";
const $$url = "/success-stories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SuccessStories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
