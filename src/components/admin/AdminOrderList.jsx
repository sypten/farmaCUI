import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // 1. CONSULTA ROBUSTA
    // Traemos 'productos' directamente sin alias para evitar confusiones
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        *,
        detalle_ventas (
          cantidad,
          precio_final_unitario,
          productos (
            nombre
          )
        )
      `)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('❌ Error cargando ventas:', error);
    } else {
      console.log('📦 Data recibida de Supabase:', data); // <--- MIRA ESTO EN CONSOLA (F12)
      setOrders(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('ventas')
      .update({ estado: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Error actualizando: ' + error.message);
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
    }
  };

  const statusColors = {
    pendiente: 'bg-orange-100 text-orange-800 border-orange-200',
    pagado: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-blue-100 text-blue-800 border-blue-200',
    entregado: 'bg-green-100 text-green-800 border-green-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200',
  };

  // Función auxiliar para extraer el nombre del producto de forma segura
  const getProductName = (item) => {
    // Caso 1: Supabase devolvió un array (común en relaciones 1:N mal detectadas)
    if (Array.isArray(item.productos)) {
      return item.productos[0]?.nombre;
    }
    // Caso 2: Supabase devolvió un objeto (lo correcto)
    if (item.productos && typeof item.productos === 'object') {
      return item.productos.nombre;
    }
    // Caso 3: No hay datos (producto borrado o error)
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farma-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">📦 Últimos Pedidos ({orders.length})</h2>
        <button onClick={fetchOrders} className="text-sm text-farma-primary hover:text-purple-700 transition font-bold">🔄 Actualizar</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Orden / Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                
                {/* 1. Cliente */}
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">#{order.numero_orden}</div>
                  <div className="text-sm text-gray-500">{order.cliente_nombre || 'Cliente'}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(order.fecha).toLocaleDateString()}
                  </div>
                  {order.direccion_envio && (
                    <div className="mt-1 text-xs bg-gray-100 p-1 rounded inline-block text-gray-600 max-w-[150px] truncate" title={order.direccion_envio}>
                      📍 {order.direccion_envio}
                    </div>
                  )}
                </td>

                {/* 2. Productos (AQUÍ ESTÁ LA MAGIA) */}
                <td className="px-6 py-4">
                  <ul className="text-sm text-gray-700 space-y-1">
                    {order.detalle_ventas && order.detalle_ventas.map((item, idx) => {
                      const nombre = getProductName(item);
                      return (
                        <li key={idx} className="flex items-center gap-2">
                           <span className="font-bold text-purple-600 bg-purple-50 px-1.5 rounded text-xs">{item.cantidad}x</span> 
                           {nombre ? (
                             <span>{nombre}</span>
                           ) : (
                             <span className="text-red-400 italic text-xs">
                               (Producto no encontrado: ID {item.producto_id})
                             </span>
                           )}
                        </li>
                      );
                    })}
                    {(!order.detalle_ventas || order.detalle_ventas.length === 0) && (
                        <li className="text-xs text-gray-400 italic">Sin detalles</li>
                    )}
                  </ul>
                </td>

                {/* 3. Total */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-farma-primary">
                    $ {order.total?.toLocaleString('es-AR')}
                  </div>
                </td>

                {/* 4. Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`block w-full text-xs font-bold py-1 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-farma-primary cursor-pointer ${statusColors[order.estado] || 'bg-gray-100 text-gray-800'}`}
                  >
                    <option value="pendiente">🕒 Pendiente</option>
                    <option value="pagado">💰 Pagado</option>
                    <option value="enviado">🚚 Enviado</option>
                    <option value="entregado">✅ Entregado</option>
                    <option value="cancelado">❌ Cancelado</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No se encontraron pedidos.
          </div>
        )}
      </div>
    </div>
  );
}