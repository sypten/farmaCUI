import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_CItJmQG-.mjs';
export { renderers } from '../../renderers.mjs';

const $$Ventas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gesti\xF3n de Ventas - Admin" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminGuard", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/AdminGuard.jsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="bg-white min-h-screen"> <header class="bg-white shadow mb-8 sticky top-0 z-40"> <div class="container mx-auto px-4 py-4 flex justify-between items-center"> <div class="flex items-center gap-2"> <span class="text-2xl">💰</span> <h1 class="text-xl font-bold text-farma-primary">Panel Administrativo</h1> </div> <div class="flex gap-6 text-sm"> <a href="/admin" class="text-farma-gray hover:text-farma-primary transition px-2">📦 Productos</a> <a href="/admin/ventas" class="text-farma-primary font-bold border-b-2 border-farma-primary pb-1 px-2">💰 Ventas</a> <a href="/" class="text-farma-gray hover:text-farma-secondary ml-4 border-l border-farma-muted pl-4">Ir a la tienda ↗</a> </div> </div> </header> <main class="container mx-auto px-4 py-8"> ${renderComponent($$result3, "AdminOrderList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/admin/AdminOrderList.jsx", "client:component-export": "default" })} </main> </div> ` })} ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/ventas.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/ventas.astro";
const $$url = "/admin/ventas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ventas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
