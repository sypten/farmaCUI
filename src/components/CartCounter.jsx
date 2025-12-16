import { useEffect, useState } from 'react';
import { cart } from '../store/cart';
import { supabase } from '../lib/supabase';

export default function CartCounter() {
  const [cartCount, setCartCount] = useState(0);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');

  // 1. Suscribirse a cambios del carrito
  useEffect(() => {
    const unsubscribe = cart.subscribe(items => {
      const values = Object.values(items).map(item => JSON.parse(item));
      const total = values.reduce((acc, current) => acc + current.quantity, 0);
      setCartCount(total);
    });

    return () => unsubscribe();
  }, []);

  // 2. Verificar sesión y rol de usuario
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const email = session.user.email || 'Usuario';
        const name = session.user.user_metadata?.full_name || email.split('@')[0];
        setUserName(name);

        // Verificar si es admin
        const { data: staff } = await supabase
          .from('usuarios_sistema')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(!!staff);
      }
    };

    checkAuth();

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        checkAuth();
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex items-center gap-4">
      {/* Botón de Carrito */}
      <a
        href="/carrito"
        className="relative p-2 text-farma-text hover:text-farma-primary transition"
        aria-label="Ver Carrito"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-farma-error text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            {cartCount}
          </span>
        )}
      </a>

      {/* Autenticación */}
      <div className="flex items-center gap-2 text-sm">
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-farma-text font-medium hidden lg:block truncate max-w-[100px]">
              {userName}
            </span>

            {isAdmin && (
              <a
                href="/admin"
                className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1 text-xs font-bold"
                title="Admin"
              >
                ⚙️
              </a>
            )}

            <a
              href="/perfil"
              className="bg-farma-accent/20 p-2 rounded-full hover:bg-farma-accent/40 transition text-farma-primary"
              title="Mi Perfil"
            >
              👤
            </a>

            <button
              onClick={handleLogout}
              className="text-farma-error hover:text-red-700 font-bold text-xs"
            >
              Salir
            </button>
          </div>
        ) : (
          <>
            <a
              href="/login"
              className="font-medium text-farma-text hover:text-farma-primary px-2"
            >
              Ingresar
            </a>
            <a
              href="/registro"
              className="hidden sm:block bg-farma-primary text-white px-4 py-1.5 rounded-full font-bold hover:bg-farma-secondary transition shadow-sm text-xs"
            >
              Registrarse
            </a>
          </>
        )}
      </div>
    </div>
  );
}
