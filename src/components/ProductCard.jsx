import { useState } from 'react';
import { addCartItem } from '../store/cart'; // <--- LA CLAVE: Conectamos con NanoStores

export default function ProductCard({ id, name, price, image, slug, category, discount }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita que el click en el botón abra la página del producto
    e.stopPropagation(); // Detiene la propagación del evento

    setIsAdding(true);
    
    // 1. Enviamos el producto al almacén global
    addCartItem({ 
      id, 
      name, 
      price, 
      image, 
      slug,
      quantity: 1 
    });

    // Pequeña animación de feedback visual
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <a 
      href={`/producto/${slug}`} 
      className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full relative"
    >
      {/* Badge de Descuento (Opcional) */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-farma-error text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </span>
      )}

      {/* Imagen */}
      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <img 
          src={image || 'https://placehold.co/300x300?text=Sin+Imagen'} 
          alt={name} 
          className="object-contain h-full w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Categoría (Linkeable) */}
        <div 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/categoria/${category?.toLowerCase().replace(/ /g, '-')}`;
            }}
            className="text-xs text-farma-muted font-bold tracking-wide uppercase mb-1 hover:text-farma-primary hover:underline cursor-pointer w-fit"
        >
          {category || 'General'}
        </div>

        {/* Título */}
        <h3 className="text-farma-text font-bold text-lg leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-farma-primary transition-colors">
          {name}
        </h3>

        {/* Precio y Botón */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Precio</span>
            <span className="text-xl font-black text-farma-secondary">
              $ {price?.toLocaleString('es-AR')}
            </span>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-sm
              ${isAdding 
                ? 'bg-farma-success text-white scale-110 ring-2 ring-green-200' 
                : 'bg-farma-primary text-white hover:bg-farma-secondary hover:shadow-lg hover:-translate-y-1'
              }
            `}
            title="Agregar al carrito"
          >
            {isAdding ? (
               // Icono de Check (Éxito)
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
               </svg>
            ) : (
               // Icono de Carrito (+)
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            )}
          </button>
        </div>
      </div>
    </a>
  );
}