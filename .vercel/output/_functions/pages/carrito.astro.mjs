/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
import { $ as $$Header } from '../chunks/Header_SyJxPTgK.mjs';
export { renderers } from '../renderers.mjs';

const $$Carrito = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mi Carrito - FarmaCUI" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 bg-white min-h-screen"> <h1 class="text-3xl font-bold text-farma-text mb-8">Mi Carrito de Compras</h1> ${renderComponent($$result2, "CartList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CartList.jsx", "client:component-export": "default" })} </main> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/carrito.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/carrito.astro";
const $$url = "/carrito";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Carrito,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
