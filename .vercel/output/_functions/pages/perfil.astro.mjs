/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
import { $ as $$Header } from '../chunks/Header_DCSvtagK.mjs';
export { renderers } from '../renderers.mjs';

const $$Perfil = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mi Perfil - FarmaCUI" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<div class="bg-white min-h-screen py-10"> <main class="container mx-auto px-4"> ${renderComponent($$result2, "UserProfile", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/UserProfile.jsx", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/perfil.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/perfil.astro";
const $$url = "/perfil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Perfil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
