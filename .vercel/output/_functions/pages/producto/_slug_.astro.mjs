/* empty css                                    */
import { e as createComponent, f as createAstro, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_CItJmQG-.mjs';
import { s as supabase, $ as $$Header } from '../../chunks/Header_SyJxPTgK.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: product, error } = await supabase.from("productos").select(`
    *,
    categoria:categorias(nombre, slug),
    imagenes:imagenes_producto(url, texto_alt)
  `).eq("slug", slug).single();
  if (error || !product) {
    return Astro2.redirect("/404");
  }
  const mainImage = product.imagenes?.[0]?.url || "https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen";
  return renderTemplate(_a || (_a = __template(["", " <script>\n  function agregarAlCarrito(id, nombre, precio) {\n    alert(`A\xF1adido: ${nombre} ($${precio})`);\n    // Aqu\xED reconectaremos tu store de NanoStores m\xE1s adelante\n  }\n<\/script>"], ["", " <script>\n  function agregarAlCarrito(id, nombre, precio) {\n    alert(\\`A\xF1adido: \\${nombre} ($\\${precio})\\`);\n    // Aqu\xED reconectaremos tu store de NanoStores m\xE1s adelante\n  }\n<\/script>"])), renderComponent($$result, "Layout", $$Layout, { "title": `${product.nombre} - FarmaCUI` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="bg-white rounded-xl shadow-lg overflow-hidden"> <div class="md:flex"> <div class="md:w-1/2 bg-white p-8 flex items-center justify-center"> <img${addAttribute(mainImage, "src")}${addAttribute(product.nombre, "alt")} class="max-h-[400px] object-contain shadow-sm rounded-lg" onerror="this.src='https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen'"> </div> <div class="md:w-1/2 p-8"> <div class="flex justify-between items-start"> <span class="text-sm text-farma-primary font-bold uppercase tracking-wider"> ${product.categoria?.nombre || "General"} </span> ${product.stock > 0 ? renderTemplate`<span class="bg-farma-success bg-opacity-20 text-farma-success text-xs font-bold px-2 py-1 rounded-full">
EN STOCK (${product.stock})
</span>` : renderTemplate`<span class="bg-farma-error bg-opacity-20 text-farma-error text-xs font-bold px-2 py-1 rounded-full">
SIN STOCK
</span>`} </div> <h1 class="text-3xl font-bold text-farma-text mt-2 mb-4">${product.nombre}</h1> <p class="text-farma-gray text-lg mb-6 leading-relaxed"> ${product.descripcion || "Sin descripci\xF3n disponible para este producto."} </p> <div class="border-t border-b border-farma-muted py-6 mb-6"> <div class="flex items-end gap-4"> <span class="text-4xl font-bold text-farma-text">
$ ${product.precio?.toLocaleString("es-AR")} </span> ${product.costo_compra > 0 && // OJO: Esto es solo para que TÚ veas que el dato existe. 
  // En producción esto no debería mostrarse al cliente.
  renderTemplate`<span class="text-xs text-gray-400 mb-2">
(Debug: Costo $${product.costo_compra})
</span>`} </div> </div> <div class="flex gap-4"> <button class="flex-1 bg-farma-primary hover:bg-farma-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"${addAttribute(`agregarAlCarrito('${product.id}', '${product.nombre}', ${product.precio})`, "onclick")}> <span>🛒</span> Agregar al Carrito
</button> <a href="/" class="px-6 py-3 border border-farma-muted text-farma-text font-bold rounded-lg hover:bg-farma-accent hover:bg-opacity-10 transition-colors">
Volver
</a> </div> </div> </div> </div> </main> ` }));
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/producto/[slug].astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/producto/[slug].astro";
const $$url = "/producto/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
