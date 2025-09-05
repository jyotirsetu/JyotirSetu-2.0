import { c as createComponent, r as renderComponent, a as renderTemplate, u as unescapeHTML } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$MarkdownLayout } from '../chunks/MarkdownLayout_Dz15Z-DI.mjs';
export { renderers } from '../renderers.mjs';

const html = () => "<p><strong>Last Updated: 2 April 2025</strong></p>\n<p>Welcome to JyotirSetu Astrology LLP (“Company”, “we”, “our”, or “us”). By booking an appointment or using our services, you agree to the following terms:</p>\n<h2 id=\"1-payments\">1. Payments</h2>\n<p>We do not take advance payments. Consultation charges are collected as per the agreed terms at the time of booking.</p>\n<h2 id=\"2-refund--cancellation\">2. Refund &#x26; Cancellation</h2>\n<p>Refunds or cancellations are subject to company policy. Clients are requested to inform us in advance in case of rescheduling or cancellation.</p>\n<h2 id=\"3-jurisdiction\">3. Jurisdiction</h2>\n<p>All disputes are subject to Gurugram, Haryana jurisdiction only.</p>\n<h2 id=\"4-disclaimer\">4. Disclaimer</h2>\n<p>Astrology, palmistry, and numerology are interpretative sciences and should be considered as guidance. We do not guarantee specific outcomes. The client is responsible for their decisions.</p>\n<h2 id=\"5-contact-for-grievances\">5. Contact for Grievances</h2>\n<p>For grievances, please contact us at:</p>\n<ul>\n<li>Email: <strong><a href=\"mailto:support@jyotirsetu.com\">support@jyotirsetu.com</a></strong></li>\n<li>Phone: <strong>+91 9999570295</strong></li>\n<li>Address: JyotirSetu Astrology LLP, 40A/5, Sector-15, Part-2, Gurugram, Haryana</li>\n</ul>";

				const frontmatter = {"title":"Terms and Conditions","layout":"~/layouts/MarkdownLayout.astro","readingTime":1};
				const file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/terms.md";
				const url = "/terms";
				function rawContent() {
					return "   \n                             \n                                        \n   \n\n**Last Updated: 2 April 2025**\n\nWelcome to JyotirSetu Astrology LLP (\"Company\", \"we\", \"our\", or \"us\"). By booking an appointment or using our services, you agree to the following terms:\n\n## 1. Payments\nWe do not take advance payments. Consultation charges are collected as per the agreed terms at the time of booking.\n\n## 2. Refund & Cancellation\nRefunds or cancellations are subject to company policy. Clients are requested to inform us in advance in case of rescheduling or cancellation.\n\n## 3. Jurisdiction\nAll disputes are subject to Gurugram, Haryana jurisdiction only.\n\n## 4. Disclaimer\nAstrology, palmistry, and numerology are interpretative sciences and should be considered as guidance. We do not guarantee specific outcomes. The client is responsible for their decisions.\n\n## 5. Contact for Grievances\nFor grievances, please contact us at:\n- Email: **support@jyotirsetu.com**\n- Phone: **+91 9999570295**\n- Address: JyotirSetu Astrology LLP, 40A/5, Sector-15, Part-2, Gurugram, Haryana\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-payments","text":"1. Payments"},{"depth":2,"slug":"2-refund--cancellation","text":"2. Refund & Cancellation"},{"depth":2,"slug":"3-jurisdiction","text":"3. Jurisdiction"},{"depth":2,"slug":"4-disclaimer","text":"4. Disclaimer"},{"depth":2,"slug":"5-contact-for-grievances","text":"5. Contact for Grievances"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${renderComponent(result, 'Layout', $$MarkdownLayout, {
								file,
								url,
								content,
								frontmatter: content,
								headings: getHeadings(),
								rawContent,
								compiledContent,
								'server:root': true,
							}, {
								'default': () => renderTemplate`${unescapeHTML(html())}`
							})}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
