import { c as createComponent, r as renderComponent, a as renderTemplate, u as unescapeHTML } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$MarkdownLayout } from '../chunks/MarkdownLayout_BUBzYP_7.mjs';
export { renderers } from '../renderers.mjs';

const html = () => "<p><strong>Last Updated: 2 April 2025</strong></p>\n<p>JyotirSetu Astrology LLP (“Company”, “we”, “our”, or “us”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services and website.</p>\n<h2 id=\"1-information-we-collect\">1. Information We Collect</h2>\n<p>We only collect information that you voluntarily provide to us when booking an appointment or contacting us (such as your name, email address, phone number, and birth details required for astrology consultations).</p>\n<h2 id=\"2-data-sharing\">2. Data Sharing</h2>\n<p>We do not sell, rent, or share your personal data with third parties for marketing purposes. Your data is kept strictly confidential.</p>\n<h2 id=\"3-data-storage--security\">3. Data Storage &#x26; Security</h2>\n<p>All data collected is stored on our secure servers. Your data is encrypted and protected, and no unauthorized access is permitted. Data is retained only as long as necessary for service delivery and is automatically deleted when no longer required.</p>\n<h2 id=\"4-your-rights\">4. Your Rights</h2>\n<p>You can contact us at any time to request deletion or correction of your data.</p>\n<h2 id=\"5-contact-us\">5. Contact Us</h2>\n<p>If you have any privacy-related concerns or requests, please email us at <strong><a href=\"mailto:privacy@jyotirsetu.com\">privacy@jyotirsetu.com</a></strong>.</p>";

				const frontmatter = {"title":"Privacy Policy","layout":"~/layouts/MarkdownLayout.astro","readingTime":1};
				const file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/privacy.md";
				const url = "/privacy";
				function rawContent() {
					return "   \n                       \n                                        \n   \n\n**Last Updated: 2 April 2025**\n\nJyotirSetu Astrology LLP (\"Company\", \"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services and website.\n\n## 1. Information We Collect\nWe only collect information that you voluntarily provide to us when booking an appointment or contacting us (such as your name, email address, phone number, and birth details required for astrology consultations).\n\n## 2. Data Sharing\nWe do not sell, rent, or share your personal data with third parties for marketing purposes. Your data is kept strictly confidential.\n\n## 3. Data Storage & Security\nAll data collected is stored on our secure servers. Your data is encrypted and protected, and no unauthorized access is permitted. Data is retained only as long as necessary for service delivery and is automatically deleted when no longer required.\n\n## 4. Your Rights\nYou can contact us at any time to request deletion or correction of your data.  \n\n## 5. Contact Us\nIf you have any privacy-related concerns or requests, please email us at **privacy@jyotirsetu.com**.\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-information-we-collect","text":"1. Information We Collect"},{"depth":2,"slug":"2-data-sharing","text":"2. Data Sharing"},{"depth":2,"slug":"3-data-storage--security","text":"3. Data Storage & Security"},{"depth":2,"slug":"4-your-rights","text":"4. Your Rights"},{"depth":2,"slug":"5-contact-us","text":"5. Contact Us"}];
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
