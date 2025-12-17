import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { a as addCartItem } from './Header_SyJxPTgK.mjs';

function ProductCard({ id, name, price, image, slug, category, discount }) {
  const [isAdding, setIsAdding] = useState(false);
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addCartItem({
      id,
      name,
      price,
      image,
      slug});
    setTimeout(() => {
      setIsAdding(false);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `/producto/${slug}`,
      className: "group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full relative",
      children: [
        discount > 0 && /* @__PURE__ */ jsxs("span", { className: "absolute top-3 left-3 bg-farma-error text-white text-xs font-bold px-2 py-1 rounded-full z-10", children: [
          "-",
          discount,
          "%"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-48 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image || "https://placehold.co/300x300?text=Sin+Imagen",
            alt: name,
            className: "object-contain h-full w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/categoria/${category?.toLowerCase().replace(/ /g, "-")}`;
              },
              className: "text-xs text-farma-muted font-bold tracking-wide uppercase mb-1 hover:text-farma-primary hover:underline cursor-pointer w-fit",
              children: category || "General"
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-farma-text font-bold text-lg leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-farma-primary transition-colors", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 font-medium", children: "Precio" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-farma-secondary", children: [
                "$ ",
                price?.toLocaleString("es-AR")
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleAddToCart,
                disabled: isAdding,
                className: `
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-sm
              ${isAdding ? "bg-farma-success text-white scale-110 ring-2 ring-green-200" : "bg-farma-primary text-white hover:bg-farma-secondary hover:shadow-lg hover:-translate-y-1"}
            `,
                title: "Agregar al carrito",
                children: isAdding ? (
                  // Icono de Check (Éxito)
                  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) })
                ) : (
                  // Icono de Carrito (+)
                  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }) })
                )
              }
            )
          ] })
        ] })
      ]
    }
  );
}

export { ProductCard as P };
