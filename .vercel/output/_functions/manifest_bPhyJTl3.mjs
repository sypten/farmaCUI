import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_B4bjZISI.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_D52TRcAH.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/","cacheDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/node_modules/.astro/","outDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/dist/","srcDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/src/","publicDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/public/","buildClientDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/dist/client/","buildServerDir":"file:///C:/Users/yomin/Documents/Proyectos/farmaCUI/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/admin/ventas","isIndex":false,"type":"page","pattern":"^\\/admin\\/ventas\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ventas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ventas.astro","pathname":"/admin/ventas","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/buscar","isIndex":false,"type":"page","pattern":"^\\/buscar\\/?$","segments":[[{"content":"buscar","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/buscar.astro","pathname":"/buscar","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/carrito","isIndex":false,"type":"page","pattern":"^\\/carrito\\/?$","segments":[[{"content":"carrito","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/carrito.astro","pathname":"/carrito","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/categoria/[slug]","isIndex":false,"type":"page","pattern":"^\\/categoria\\/([^/]+?)\\/?$","segments":[[{"content":"categoria","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/categoria/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/perfil","isIndex":false,"type":"page","pattern":"^\\/perfil\\/?$","segments":[[{"content":"perfil","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/perfil.astro","pathname":"/perfil","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/producto/[slug]","isIndex":false,"type":"page","pattern":"^\\/producto\\/([^/]+?)\\/?$","segments":[[{"content":"producto","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/producto/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/registro","isIndex":false,"type":"page","pattern":"^\\/registro\\/?$","segments":[[{"content":"registro","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/registro.astro","pathname":"/registro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":".no-scrollbar[data-astro-cid-t5k2tvbq]::-webkit-scrollbar{display:none}.no-scrollbar[data-astro-cid-t5k2tvbq]{-ms-overflow-style:none;scrollbar-width:none}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/admin/ventas.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/buscar.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/carrito.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/categoria/[slug].astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/perfil.astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/producto/[slug].astro",{"propagation":"none","containsHead":true}],["C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/registro.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/admin/ventas@_@astro":"pages/admin/ventas.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/buscar@_@astro":"pages/buscar.astro.mjs","\u0000@astro-page:src/pages/carrito@_@astro":"pages/carrito.astro.mjs","\u0000@astro-page:src/pages/categoria/[slug]@_@astro":"pages/categoria/_slug_.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/perfil@_@astro":"pages/perfil.astro.mjs","\u0000@astro-page:src/pages/producto/[slug]@_@astro":"pages/producto/_slug_.astro.mjs","\u0000@astro-page:src/pages/registro@_@astro":"pages/registro.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_bPhyJTl3.mjs","C:/Users/yomin/Documents/Proyectos/farmaCUI/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BRlrelZe.mjs","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/ProductCard.jsx":"_astro/ProductCard.DrT71NGV.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/SearchWidget.jsx":"_astro/SearchWidget.v1IZfyxj.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CartCounter.jsx":"_astro/CartCounter.Co6N8DwT.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/AdminGuard.jsx":"_astro/AdminGuard.BphzUBHA.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/admin/AdminOrderList.jsx":"_astro/AdminOrderList.B0VfBL_e.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/admin/AdminDashboard.jsx":"_astro/AdminDashboard.BmeiJ1RQ.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CartList.jsx":"_astro/CartList.DJsAfPtD.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/UserProfile.jsx":"_astro/UserProfile.dE0ng3tP.js","@astrojs/react/client.js":"_astro/client.CTDoNXH3.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.ChXNBYZR.js","C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/registro.astro?astro&type=script&index=0&lang.ts":"_astro/registro.astro_astro_type_script_index_0_lang.Dy8Hf7A3.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/favicon.svg","/_astro/AdminDashboard.BmeiJ1RQ.js","/_astro/AdminGuard.BphzUBHA.js","/_astro/AdminOrderList.B0VfBL_e.js","/_astro/cart.DPhlNxo8.js","/_astro/CartCounter.Co6N8DwT.js","/_astro/CartList.DJsAfPtD.js","/_astro/client.CTDoNXH3.js","/_astro/index.D55ewHcJ.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/login.astro_astro_type_script_index_0_lang.ChXNBYZR.js","/_astro/ProductCard.DrT71NGV.js","/_astro/registro.astro_astro_type_script_index_0_lang.Dy8Hf7A3.js","/_astro/SearchWidget.v1IZfyxj.js","/_astro/supabase.CKd-pqSN.js","/_astro/UserProfile.dE0ng3tP.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"GD6VfJk1kiW4bouutftQq5S7vPFQsGBH0OWHIhydN7Q="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
