import { e as createComponent, f as createAstro, h as addAttribute, n as renderHead, o as renderSlot, r as renderTemplate } from './astro/server_B4bjZISI.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Farmacia Web Demo"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-white min-h-screen"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
