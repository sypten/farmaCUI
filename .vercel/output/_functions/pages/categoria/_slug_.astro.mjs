/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_CItJmQG-.mjs';
import { s as supabase, $ as $$Header } from '../../chunks/Header_DCSvtagK.mjs';
import { P as ProductCard } from '../../chunks/ProductCard_Dz8RWXdo.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: categoria, error: catError } = await supabase.from("categorias").select("*").eq("slug", slug).single();
  if (!categoria) {
    return Astro2.redirect("/404");
  }
  const { data: products, error: prodError } = await supabase.from("productos").select(`
    *,
    imagenes:imagenes_producto(url)
  `).gt("stock", 0).eq("categoria_id", categoria.id).order("creado_en", { ascending: false });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${categoria.nombre} - FarmaCUI` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<div class="bg-white min-h-screen py-8"> <main class="container mx-auto px-4"> <div class="mb-8 flex items-end gap-4 border-b pb-4 border-farma-muted"> <div> <p class="text-sm text-farma-gray font-bold uppercase tracking-wider mb-1">Categoría</p> <h1 class="text-4xl font-extrabold text-farma-primary">${categoria.nombre}</h1> </div> <span class="text-farma-gray pb-2">
(${products ? products.length : 0} productos)
</span> </div> ${products && products.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", ProductCard, { "client:visible": true, "id": product.id, "name": product.nombre, "price": product.precio, "image": product.imagenes?.[0]?.url || "", "slug": product.slug, "discount": 0, "category": categoria.nombre, "client:component-hydration": "visible", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/ProductCard.jsx", "client:component-export": "default" })}`)} </div>` : (
    // Estado Vacío
    renderTemplate`<div class="text-center py-20"> <div class="text-6xl mb-4">📦</div> <h3 class="text-xl font-bold text-gray-700">Esta categoría está vacía</h3> <p class="text-gray-500 mt-2">Pronto agregaremos productos aquí.</p> <a href="/" class="inline-block mt-6 px-6 py-2 bg-farma-primary text-white rounded hover:bg-farma-secondary transition">
Volver al inicio
</a> </div>`
  )} </main> </div> ` })}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/categoria/[slug].astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/categoria/[slug].astro";
const $$url = "/categoria/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
