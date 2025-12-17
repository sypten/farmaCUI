import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel de Control - FarmaCUI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gray-100 min-h-screen font-sans"> <header class="bg-white shadow mb-8 sticky top-0 z-40"> <div class="container mx-auto px-4 py-4 flex justify-between items-center"> <div class="flex items-center gap-2"> <span class="text-2xl">⚙️</span> <h1 class="text-xl font-bold text-farma-primary">Panel de Control</h1> </div> <nav class="flex gap-6 text-sm"> <a href="/admin" class="text-farma-primary font-bold border-b-2 border-farma-primary pb-1 px-2">📦 Productos</a> <a href="/admin/ventas" class="text-gray-500 hover:text-farma-primary transition pb-1 px-2">💰 Ventas</a> <a href="/" class="text-gray-400 hover:text-farma-secondary ml-4 border-l border-gray-300 pl-4">Ir a la tienda ↗</a> </nav> </div> </header> <main class="container mx-auto px-4 pb-12"> ${renderComponent($$result2, "AdminGuard", null, { "client:only": "react", "allowedRoles": ["admin", "superadmin", "staff"], "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/AdminGuard.jsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "AdminDashboard", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/admin/AdminDashboard.jsx", "client:component-export": "default" })} ` })} </main> </div> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
