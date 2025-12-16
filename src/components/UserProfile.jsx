import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        // 1. Verificar Sesión
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Si no hay usuario, mandar al login
          window.location.href = '/login';
          return;
        }

        setUser(user);

        // 2. Traer el Historial de Pedidos
        const { data, error } = await supabase
          .from('ventas')
          .select(`
            *,
            detalle_ventas (
              cantidad,
              precio_final_unitario,
              producto:productos (nombre)
            )
          `)
          .eq('cliente_id', user.id)
          .order('fecha', { ascending: false });

        if (error) throw error;
        setOrdenes(data || []);

      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  // Si por alguna razón terminó de cargar y no hay usuario (redirección en proceso), no mostramos nada
  if (!user) return null;

  const nombreUsuario = user.user_metadata?.full_name || user.email;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
      {/* BARRA LATERAL (Datos Usuario) */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-gray-800 break-words">{nombreUsuario}</h2>
          <p className="text-gray-500 text-sm mb-4 break-all">{user.email}</p>
          
          <hr className="my-4 border-gray-100" />
          
          <div className="text-left text-sm text-gray-600 space-y-2">
            <p>📅 Miembro desde: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          
          <button 
            onClick={async () => { await supabase.auth.signOut(); window.location.href='/'; }}
            className="mt-6 w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 text-sm font-bold"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL (Pedidos) */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

        {ordenes.length > 0 ? (
          <div className="space-y-6">
            {ordenes.map((orden) => (
              <div key={orden.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                
                {/* Cabecera del Pedido */}
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Orden</span>
                    <p className="font-mono text-gray-800 font-bold">#{orden.numero_orden}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Fecha</span>
                    <p className="text-gray-700">{new Date(orden.fecha).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Total</span>
                    <p className="text-green-600 font-bold">$ {orden.total_final?.toLocaleString('es-AR')}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block
                      ${orden.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        orden.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {orden.estado}
                    </span>
                  </div>
                </div>

                {/* Lista de Productos del Pedido */}
                <div className="p-4">
                  <ul className="divide-y divide-gray-100">
                    {orden.detalle_ventas.map((item, idx) => (
                      <li key={idx} className="py-2 flex justify-between text-sm">
                        <span className="text-gray-700">
                          <span className="font-bold">{item.cantidad}x</span> {item.producto?.nombre || 'Producto no disponible'}
                        </span>
                        <span className="text-gray-500">
                          $ {item.precio_final_unitario?.toLocaleString('es-AR')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900">Aún no tienes pedidos</h3>
            <p className="text-gray-500 mb-6">¿Qué esperas para estrenar tu carrito?</p>
            <a href="/" className="text-blue-600 hover:underline font-bold">Ir a la tienda</a>
          </div>
        )}
      </div>

    </div>
  );
}