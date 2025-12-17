import { e as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from './astro/server_B4bjZISI.mjs';
import 'piccolore';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { persistentMap } from '@nanostores/persistent';
import 'clsx';
/* empty css                          */

const supabaseUrl = "https://pksqsrkkkkbcylfrnzwd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc3Fzcmtra2tiY3lsZnJuendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDgwNDIsImV4cCI6MjA4MTIyNDA0Mn0.8nSNdxy13GTzMvL7VCNqGUKN_otHaesBmjkocm4g8mI";
const supabase = createClient(supabaseUrl, supabaseKey);

function SearchWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.from("productos").select(`
            id, nombre, slug, precio,
            imagenes:imagenes_producto(url)
        `).ilike("nombre", `%${query}%`).limit(5);
      if (!error && data) {
        setResults(data);
        setShowDropdown(true);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [query]);
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map(
      (part, index) => regex.test(part) ? /* @__PURE__ */ jsx("strong", { className: "text-farma-primary font-extrabold", children: part }, index) : part
    );
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/buscar?q=${query}`;
  };
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearchSubmit, className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          },
          onFocus: () => query.length >= 2 && setShowDropdown(true),
          placeholder: "Buscar medicamentos, marcas...",
          className: "w-full border border-farma-muted rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-farma-primary focus:ring-1 focus:ring-farma-primary bg-white text-farma-text"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-gray-400", children: loading ? /* @__PURE__ */ jsx("div", { className: "animate-spin h-5 w-5 border-2 border-farma-primary border-t-transparent rounded-full" }) : "🔍" })
    ] }),
    showDropdown && query.length >= 2 && /* @__PURE__ */ jsx("div", { className: "absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden", children: loading ? (
      // Estado de carga (opcional, ya tenemos el spinner arriba, pero por si acaso)
      /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-400 text-sm", children: "Buscando..." })
    ) : results.length > 0 ? (
      // CASO A: HAY RESULTADOS
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ul", { children: results.map((prod) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/producto/${prod.slug}`,
            className: "flex items-center gap-4 p-3 hover:bg-farma-accent hover:bg-opacity-20 transition-colors border-b border-farma-muted last:border-0",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 bg-white border border-farma-muted rounded overflow-hidden", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: prod.imagenes?.[0]?.url || "https://placehold.co/50",
                  alt: prod.nombre,
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 truncate", children: highlightMatch(prod.nombre, query) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-farma-primary font-bold", children: [
                  "$ ",
                  prod.precio.toLocaleString("es-AR")
                ] })
              ] })
            ]
          }
        ) }, prod.id)) }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/buscar?q=${query}`,
            className: "block text-center text-xs text-farma-primary font-bold bg-white border-t border-farma-muted p-2 hover:underline",
            children: [
              'Ver todos los resultados para "',
              query,
              '"'
            ]
          }
        )
      ] })
    ) : (
      // CASO B: NO HAY RESULTADOS (NUEVO)
      /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-4xl mb-2", children: "🤔" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm font-medium", children: "No encontramos coincidencias" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs mt-1", children: "Intenta con otro término o marca." })
      ] })
    ) })
  ] });
}

// 1. Creamos el almacén (Store)
// Usamos persistentMap para que se guarde en localStorage automáticamente.
// La clave 'farmacui-cart' es como se verá en el navegador.
const cart = persistentMap('farmacui-cart', {});

/**
 * Estructura de datos:
 * {
 * 'id_producto_1': { id, nombre, precio, imagen, cantidad: 2 },
 * 'id_producto_2': { id, nombre, precio, imagen, cantidad: 1 },
 * }
 */

// 2. Función para agregar productos
function addCartItem({ id, name, price, image, slug }) {
  const existingEntry = cart.get()[id];
  
  if (existingEntry) {
    // Si ya existe, le parseamos la info y sumamos 1
    // (localStorage guarda todo como texto, por eso JSON.parse/stringify)
    const item = JSON.parse(existingEntry);
    item.quantity += 1;
    cart.setKey(id, JSON.stringify(item));
  } else {
    // Si es nuevo, lo creamos con cantidad 1
    cart.setKey(id, JSON.stringify({
      id,
      name,
      price,
      image,
      slug,
      quantity: 1
    }));
  }
}

function CartCounter() {
  const [cartCount, setCartCount] = useState(0);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const unsubscribe = cart.subscribe((items) => {
      const values = Object.values(items).map((item) => JSON.parse(item));
      const total = values.reduce((acc, current) => acc + current.quantity, 0);
      setCartCount(total);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: session2 } } = await supabase.auth.getSession();
      setSession(session2);
      if (session2) {
        const email = session2.user.email || "Usuario";
        const name = session2.user.user_metadata?.full_name || email.split("@")[0];
        setUserName(name);
        const { data: staff } = await supabase.from("usuarios_sistema").select("rol").eq("id", session2.user.id).single();
        setIsAdmin(!!staff);
      }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        checkAuth();
      }
    });
    return () => subscription?.unsubscribe();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: "/carrito",
        className: "relative p-2 text-farma-text hover:text-farma-primary transition",
        "aria-label": "Ver Carrito",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                }
              )
            }
          ),
          cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-farma-error text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce", children: cartCount })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm", children: session ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-farma-text font-medium hidden lg:block truncate max-w-[100px]", children: userName }),
      isAdmin && /* @__PURE__ */ jsx(
        "a",
        {
          href: "/admin",
          className: "bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1 text-xs font-bold",
          title: "Admin",
          children: "⚙️"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/perfil",
          className: "bg-farma-accent/20 p-2 rounded-full hover:bg-farma-accent/40 transition text-farma-primary",
          title: "Mi Perfil",
          children: "👤"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          className: "text-farma-error hover:text-red-700 font-bold text-xs",
          children: "Salir"
        }
      )
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/login",
          className: "font-medium text-farma-text hover:text-farma-primary px-2",
          children: "Ingresar"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/registro",
          className: "hidden sm:block bg-farma-primary text-white px-4 py-1.5 rounded-full font-bold hover:bg-farma-secondary transition shadow-sm text-xs",
          children: "Registrarse"
        }
      )
    ] }) })
  ] });
}

const $$CategoryNav = createComponent(async ($$result, $$props, $$slots) => {
  const { data: categorias } = await supabase.from("categorias").select("nombre, slug").order("nombre", { ascending: true });
  return renderTemplate`${maybeRenderHead()}<nav class="bg-farma-secondary text-white shadow-inner w-full border-t border-farma-secondary" data-astro-cid-t5k2tvbq> <div class="container mx-auto px-4" data-astro-cid-t5k2tvbq> <ul class="flex gap-6 overflow-x-auto text-sm font-medium whitespace-nowrap py-0 no-scrollbar" data-astro-cid-t5k2tvbq> <li class="flex-shrink-0" data-astro-cid-t5k2tvbq> <a href="/" class="block py-3 hover:text-farma-accent border-b-2 border-transparent hover:border-farma-accent transition-colors" data-astro-cid-t5k2tvbq>
Todas
</a> </li> ${categorias && categorias.map((cat) => renderTemplate`<li class="flex-shrink-0" data-astro-cid-t5k2tvbq> <a${addAttribute(`/categoria/${cat.slug}`, "href")} class="block py-3 hover:text-farma-accent border-b-2 border-transparent hover:border-farma-accent transition-colors capitalize" data-astro-cid-t5k2tvbq> ${cat.nombre} </a> </li>`)} </ul> </div> </nav> `;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CategoryNav.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="bg-white shadow-sm sticky top-0 z-50"> <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4"> <a href="/" class="text-2xl font-black text-farma-primary flex items-center gap-2 hover:opacity-80 transition">
💊 FarmaCUI
</a> <div class="flex-1 max-w-lg hidden md:block mx-4"> ${renderComponent($$result, "SearchWidget", SearchWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/SearchWidget.jsx", "client:component-export": "default" })} </div> ${renderComponent($$result, "CartCounter", CartCounter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CartCounter.jsx", "client:component-export": "default" })} </div> <div class="md:hidden px-4 pb-3"> ${renderComponent($$result, "SearchWidget", SearchWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/SearchWidget.jsx", "client:component-export": "default" })} </div> ${renderComponent($$result, "CategoryNav", $$CategoryNav, {})} </header>`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/Header.astro", void 0);

export { $$Header as $, addCartItem as a, supabase as s };
