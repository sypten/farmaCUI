import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D_QMHPFT.mjs';
import { manifest } from './manifest_DihEBpoJ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/ventas.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/buscar.astro.mjs');
const _page4 = () => import('./pages/carrito.astro.mjs');
const _page5 = () => import('./pages/categoria/_slug_.astro.mjs');
const _page6 = () => import('./pages/login.astro.mjs');
const _page7 = () => import('./pages/perfil.astro.mjs');
const _page8 = () => import('./pages/producto/_slug_.astro.mjs');
const _page9 = () => import('./pages/registro.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/ventas.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/buscar.astro", _page3],
    ["src/pages/carrito.astro", _page4],
    ["src/pages/categoria/[slug].astro", _page5],
    ["src/pages/login.astro", _page6],
    ["src/pages/perfil.astro", _page7],
    ["src/pages/producto/[slug].astro", _page8],
    ["src/pages/registro.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "1ae8325c-c9dc-4eb9-8250-001309a888f3",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
