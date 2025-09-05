import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../chunks/PageLayout_C26AfJxu.mjs';
import { $ as $$Hero } from '../chunks/Hero_P0x0i3WZ.mjs';
export { renderers } from '../renderers.mjs';

const $$ThankYou = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Thank You - JyotirSetu",
    description: "Your appointment request has been submitted successfully. Thank you for choosing JyotirSetu for your spiritual guidance.",
    canonical: "https://jyotirsetu.com/thank-you",
    openGraph: {
      url: "https://jyotirsetu.com/thank-you",
      siteName: "JyotirSetu",
      images: [
        {
          url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8MHwyfDB8fHwy",
          width: 1200,
          height: 630
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      handle: "@jyotirsetu",
      site: "@jyotirsetu",
      cardType: "summary_large_image"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "image": { src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8MHwyfDB8fHwy", alt: "Thank You - JyotirSetu" }, "title": "\u2705 Your Booking is Confirmed!", "subtitle": "Thank you for trusting JyotirSetu with your spiritual journey" }, { "title": ($$result3) => renderTemplate`${maybeRenderHead()}<div>
✅ <span class="text-accent dark:text-white">Your Booking is Confirmed!</span> </div>` })}  <section class="py-16 bg-page"> <div class="max-w-4xl mx-auto px-6 text-center"> <div class="mb-12"> <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"> <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <h2 class="text-3xl font-bold text-heading mb-4">🌠 Appointment Request Submitted Successfully</h2> <p class="text-lg text-muted mb-6">
Thank you for trusting JyotirSetu. Your consultation request has been recorded, and we'll confirm your appointment according to your selected date and time.
</p> <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"> <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">📧 What Happens Next?</h3> <ul class="text-left text-blue-700 dark:text-blue-300 space-y-2"> <li class="flex items-start"> <span class="text-blue-500 mr-2">•</span>
You'll receive a confirmation email within 24 hours
</li> <li class="flex items-start"> <span class="text-blue-500 mr-2">•</span>
Our team will review your request and confirm the exact timing
</li> <li class="flex items-start"> <span class="text-blue-500 mr-2">•</span>
We'll send you a WhatsApp message with consultation details
</li> <li class="flex items-start"> <span class="text-blue-500 mr-2">•</span>
Prepare your birth details and specific questions for the session
</li> </ul> </div> </div> <!-- Download Section --> <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 mb-12"> <h3 class="text-2xl font-bold text-heading mb-4">🎁 Your Free Gift: Dosha Balancing Guide</h3> <p class="text-muted mb-6">
While you wait for your consultation, start your journey with our comprehensive guide to balancing your doshas and improving your well-being.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center items-center"> <a href="/dosha-guide.pdf" download class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg>
Download Free Guide
</a> <a href="/resources" class="inline-flex items-center justify-center px-6 py-4 border border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white font-medium rounded-lg transition-all duration-200">
Browse More Resources
</a> </div> </div> <!-- Next Steps Section --> <div class="grid md:grid-cols-2 gap-8 mb-12"> <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"> <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h4 class="text-lg font-semibold text-heading mb-2">⏰ Prepare for Your Session</h4> <p class="text-muted text-sm">
Gather your birth details, specific questions, and any concerns you'd like to discuss during your consultation.
</p> </div> <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"> <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg> </div> <h4 class="text-lg font-semibold text-heading mb-2">💬 Need Help?</h4> <p class="text-muted text-sm">
Have questions about your booking? Contact us via WhatsApp or email. We're here to help!
</p> </div> </div> <!-- Contact & Social Links --> <div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-8"> <h3 class="text-xl font-bold text-heading mb-6">Stay Connected with JyotirSetu</h3> <div class="grid md:grid-cols-3 gap-6 mb-8"> <div class="text-center"> <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3"> <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"></path> </svg> </div> <h4 class="font-semibold text-heading mb-2">WhatsApp</h4> <a href="https://wa.me/919266991298" class="text-green-600 dark:text-green-400 hover:underline">+91 92669 91298</a> </div> <div class="text-center"> <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3"> <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <h4 class="font-semibold text-heading mb-2">Email</h4> <a href="mailto:contact@jyotirsetu.com" class="text-blue-600 dark:text-blue-400 hover:underline">contact@jyotirsetu.com</a> </div> <div class="text-center"> <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3"> <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <h4 class="font-semibold text-heading mb-2">Location</h4> <a href="https://maps.google.com/?q=F28W+MV+Gurugram+Haryana" target="_blank" class="text-purple-600 dark:text-purple-400 hover:underline">Sector-15, Gurugram</a> </div> </div> <div class="text-center"> <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200">
← Back to Homepage
</a> </div> </div> </div> </section> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/thank-you.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/thank-you.astro";
const $$url = "/thank-you";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ThankYou,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
