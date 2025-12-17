/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
import { s as supabase, $ as $$Header } from '../chunks/Header_SyJxPTgK.mjs';
import { P as ProductCard } from '../chunks/ProductCard_DADkbIRU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Buscar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Buscar;
  const query = Astro2.url.searchParams.get("q") || "";
  let products = [];
  let errorMsg = null;
  if (query) {
    const { data, error } = await supabase.from("productos").select(`
        *,
        categoria:categorias(nombre, slug),
        imagenes:imagenes_producto(url)
    `).gt("stock", 0).ilike("nombre", `%${query}%`).order("precio", { ascending: true });
    if (error) {
      errorMsg = error.message;
    } else {
      products = data;
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Resultados para "${query}" - FarmaCUI` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold text-farma-text"> ${query ? `Resultados para: "${query}"` : "B\xFAsqueda de Productos"} </h1> <p class="text-farma-gray"> ${query ? `Se encontraron ${products.length} coincidencias.` : "Escribe algo en el buscador para comenzar."} </p> </div> ${errorMsg && renderTemplate`<div class="bg-farma-error bg-opacity-10 text-farma-error p-4 rounded mb-6 border border-farma-error border-opacity-20">Error: ${errorMsg}</div>`}  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", ProductCard, { "client:load": true, "id": product.id, "name": product.nombre, "price": product.precio, "image": product.imagenes?.[0]?.url || "", "slug": product.slug, "discount": 0, "category": product.categoria?.nombre || "General", "client:component-hydration": "load", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/ProductCard.jsx", "client:component-export": "default" })}`)} </div> ${query && products.length === 0 && renderTemplate`<div class="text-center py-20 bg-white rounded-lg border border-farma-muted border-dashed"> <p class="text-farma-gray text-lg">No encontramos productos con ese nombre. 🕵️‍♀️</p> <a href="/" class="text-farma-primary font-bold hover:underline mt-2 inline-block">Ver todo el catálogo</a> </div>`} </main> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/buscar.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/buscar.astro";
const $$url = "/buscar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Buscar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
