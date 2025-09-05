import { d as createAstro, c as createComponent, r as renderComponent, F as Fragment, a as renderTemplate, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, e as renderScript } from './astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { f as findImage, i as isUnpicCompatible, g as getImagesOptimized, u as unpicOptimizer, b as astroAssetsOptimizer } from './images_aTjQ4cVG.mjs';
/* empty css                                                            */

const $$Astro = createAstro("https://jyotirsetu.com");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new Error();
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  if (!props.loading) {
    props.loading = "lazy";
  }
  if (!props.decoding) {
    props.decoding = "async";
  }
  const _image = await findImage(props.src);
  let image = void 0;
  if (typeof _image === "string" && (_image.startsWith("http://") || _image.startsWith("https://")) && isUnpicCompatible(_image)) {
    image = await getImagesOptimized(_image, props, unpicOptimizer);
  } else if (_image) {
    image = await getImagesOptimized(_image, props, astroAssetsOptimizer);
  }
  return renderTemplate`${!image ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {})}` : renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")} crossorigin="anonymous" referrerpolicy="no-referrer"${spreadAttributes(image.attributes)}>`}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/common/Image.astro", void 0);

const $$Logo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<a href="/" class="flex items-center logo-container" data-astro-cid-tvrurpns> <!-- Dark Theme Logo (White/Transparent) --> ${renderComponent($$result, "Image", $$Image, { "src": "~/assets/images/Jyotirsetu-logo.png", "alt": "JyotirSetu Logo", "width": 200, "height": 60, "class": "h-10 md:h-12 w-auto max-w-[180px] md:max-w-[220px] object-contain dark:block hidden", "id": "logo-dark", "data-astro-cid-tvrurpns": true })} <!-- Light Theme Logo (Blue) --> ${renderComponent($$result, "Image", $$Image, { "src": "~/assets/images/Jyotirsetu-logo-blue.png", "alt": "JyotirSetu Logo", "width": 200, "height": 60, "class": "h-10 md:h-12 w-auto max-w-[180px] md:max-w-[220px] object-contain block dark:hidden", "id": "logo-light", "data-astro-cid-tvrurpns": true })} </a>  ${renderScript($$result, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/Logo.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/Logo.astro", void 0);

export { $$Image as $, $$Logo as a };
