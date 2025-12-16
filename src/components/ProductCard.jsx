import React from 'react';
// Importamos la acción para agregar al carrito
import { addCartItem } from '../store/cart'; 

export default function ProductCard({ id, name, price, image, slug, discount, category }) {
  
  // Función que maneja el clic en el botón "+"
  const handleAddToCart = (e) => {
    e.preventDefault(); // 1. Evita que el link <a> se active
    e.stopPropagation(); // 2. Evita que el clic suba al contenedor padre
    
    // 3. Agregamos al Store Global
    addCartItem({
      id,
      name,
      price,
      image, // Guardamos la URL de la imagen para mostrarla en el carrito después
      slug
    });

    // Opcional: Feedback visual en consola
    console.log(`Agregado al carrito: ${name}`); 
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white relative group h-full flex flex-col justify-between">
      
      {/* Enlace que envuelve la imagen y el título */}
      <a href={`/producto/${slug}`} className="block">
        
        {/* ZONA DE IMAGEN */}
        <div className="w-full h-48 flex items-center justify-center overflow-hidden mb-4 bg-gray-100 rounded relative">
            <img 
              // Usamos la imagen real O BIEN el placeholder si viene vacía
              src={image || 'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen'} 
              alt={name} 
              className="object-contain h-full w-full mix-blend-multiply"
              loading="lazy"
              // Si la imagen falla al cargar (404), ponemos la de relleno automáticamente
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen'; 
              }}
            />
            
            {/* Badge de Descuento (Solo si es mayor a 0) */}
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                {discount}% OFF
              </span>
            )}
        </div>

        {/* ZONA DE TEXTOS */}
        <div className="mt-2">
            <a 
              href={`/categoria/${category.toLowerCase().replace(/ /g, '-')}`} 
              className="text-xs text-blue-500 mb-1 uppercase font-bold tracking-wide hover:underline hover:text-blue-700 z-10 relative"
              onClick={(e) => e.stopPropagation()} // Para que no abra la ficha del producto al hacer clic aquí
            >
                {category}
            </a>

            <h3 className="text-lg font-semibold text-gray-800 truncate leading-tight" title={name}>
                {name}
            </h3>
        </div>
      </a>
      
      {/* ZONA DE PRECIO Y BOTÓN (Parte inferior) */}
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
        <div className="flex flex-col">
            <span className="text-xl font-bold text-orange-500">
              $ {price?.toLocaleString('es-AR')}
            </span>
            {/* Aquí podrías mostrar precio de lista tachado si hubiera descuento */}
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="bg-blue-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-800 active:bg-blue-950 transition-all shadow-sm hover:shadow active:scale-95"
          title="Agregar al carrito"
          aria-label="Agregar al carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

    </div>
  );
}