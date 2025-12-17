import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4bjZISI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CItJmQG-.mjs';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar Sesi\xF3n - FarmaCUI" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex items-center justify-center min-h-screen bg-white"> <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md"> <h1 class="text-2xl font-bold text-center mb-6 text-farma-text">Bienvenido de nuevo</h1> <form id="login-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-farma-text">Email</label> <input type="email" name="email" required class="w-full p-2 border rounded mt-1"> </div> <div> <label class="block text-sm font-medium text-farma-text">Contraseña</label> <input type="password" name="password" required class="w-full p-2 border rounded mt-1"> </div> <button type="submit" class="w-full bg-farma-primary text-white py-2 rounded hover:bg-farma-secondary font-bold">
Ingresar
</button> </form> <p class="mt-4 text-center text-sm text-farma-gray">
¿Nuevo aquí? <a href="/registro" class="text-farma-primary hover:underline">Crea una cuenta</a> </p> <div id="message" class="mt-4 text-center text-sm hidden text-farma-error"></div> </div> </div> ` })} ${renderScript($$result, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/login.astro", void 0);

const $$file = "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
