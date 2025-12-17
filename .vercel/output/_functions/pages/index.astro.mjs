import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
import { s as supabase, $ as $$Header } from '../chunks/Header_DCSvtagK.mjs';
import { P as ProductCard } from '../chunks/ProductCard_Dz8RWXdo.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: products, error } = await supabase.from("productos").select(`
    *,
    categoria:categorias(nombre, slug),
    imagenes:imagenes_producto(url)
  `).gt("stock", 0).order("creado_en", { ascending: false });
  if (error) {
    console.error("Error cargando productos:", error.message);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "FarmaCUI - Tu Farmacia Online" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="mb-10 text-center bg-farma-accent bg-opacity-10 rounded-xl p-8 shadow-sm"> <h1 class="text-4xl font-extrabold text-farma-primary mb-2">Bienvenido a FarmaCUI</h1> <p class="text-farma-gray text-lg">Cuidamos de ti y de tu familia con los mejores precios.</p> </div> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold text-farma-text border-l-4 border-farma-primary pl-3">
Productos Destacados
</h2> <a href="/categoria/farmacia" class="text-farma-primary hover:underline text-sm font-semibold">
Ver todos →
</a> </div> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products && products.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", ProductCard, { "client:load": true, "id": product.id, "name": product.nombre, "price": product.precio, "image": product.imagenes?.[0]?.url || "", "slug": product.slug, "discount": 0, "category": product.categoria?.nombre || "General", "client:component-hydration": "load", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/ProductCard.jsx", "client:component-export": "default" })}`)} </div> ${(!products || products.length === 0) && renderTemplate`<div class="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300"> <div class="text-6xl mb-4">💊</div> <h3 class="text-xl font-bold text-gray-700">Aún no hay productos</h3> <p class="text-gray-500">Entra al panel de administración para cargar el primero.</p> </div>`} </main> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/index.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
