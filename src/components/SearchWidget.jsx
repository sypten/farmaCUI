import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function SearchWidget() {
  const [query, setQuery] = useState('');
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
      // Si escriben menos de 2 letras, limpiamos y no buscamos
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('productos')
        .select(`
            id, nombre, slug, precio,
            imagenes:imagenes_producto(url)
        `)
        .ilike('nombre', `%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
        // showDropdown ya se activa en el onChange, pero aquí confirmamos
        setShowDropdown(true);
      }
      setLoading(false);

    }, 300);

    return () => clearTimeout(timeOutId);
  }, [query]);

  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <strong key={index} className="text-farma-primary font-extrabold">{part}</strong> : part
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/buscar?q=${query}`;
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      
      <form onSubmit={handleSearchSubmit} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder="Buscar medicamentos, marcas..." 
          className="w-full border border-farma-muted rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-farma-primary focus:ring-1 focus:ring-farma-primary bg-white text-farma-text"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
            {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-farma-primary border-t-transparent rounded-full"></div>
            ) : '🔍'}
        </span>
      </form>

      {/* MODIFICACIÓN AQUÍ: Mostramos el dropdown si showDropdown es true y hay texto suficiente */}
      {showDropdown && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          
          {loading ? (
             // Estado de carga (opcional, ya tenemos el spinner arriba, pero por si acaso)
             <div className="p-4 text-center text-gray-400 text-sm">Buscando...</div>
          ) : results.length > 0 ? (
            // CASO A: HAY RESULTADOS
            <>
                <ul>
                    {results.map((prod) => (
                    <li key={prod.id}>
                        <a 
                        href={`/producto/${prod.slug}`} 
                        className="flex items-center gap-4 p-3 hover:bg-farma-accent hover:bg-opacity-20 transition-colors border-b border-farma-muted last:border-0"
                        >
                        <div className="flex-shrink-0 w-12 h-12 bg-white border border-farma-muted rounded overflow-hidden">
                            <img 
                            src={prod.imagenes?.[0]?.url || 'https://placehold.co/50'} 
                            alt={prod.nombre} 
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">
                            {highlightMatch(prod.nombre, query)}
                            </p>
                            <p className="text-xs text-farma-primary font-bold">
                            $ {prod.precio.toLocaleString('es-AR')}
                            </p>
                        </div>
                        </a>
                    </li>
                    ))}
                </ul>
                <a 
                    href={`/buscar?q=${query}`}
                    className="block text-center text-xs text-farma-primary font-bold bg-white border-t border-farma-muted p-2 hover:underline"
                >
                    Ver todos los resultados para "{query}"
                </a>
            </>
          ) : (
            // CASO B: NO HAY RESULTADOS (NUEVO)
            <div className="p-6 text-center">
                <p className="text-4xl mb-2">🤔</p>
                <p className="text-gray-500 text-sm font-medium">No encontramos coincidencias</p>
                <p className="text-gray-400 text-xs mt-1">Intenta con otro término o marca.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}