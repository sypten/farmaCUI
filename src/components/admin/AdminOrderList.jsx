import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar Ventas
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // Traemos la venta y sus detalles anidados
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
      .order('fecha', { ascending: false }); // Más recientes primero

    if (error) console.error('Error cargando ventas:', error);
    else setOrders(data);
    setLoading(false);
  };

  // Función para cambiar estado
  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('ventas')
      .update({ estado: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Error actualizando: ' + error.message);
    } else {
      // Actualizamos la UI localmente para no recargar todo
      setOrders(orders.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
    }
  };

  // Colores para las etiquetas de estado - Paleta FarmaCUI
  const statusColors = {
    pendiente: 'bg-farma-warning bg-opacity-20 text-farma-warning border-farma-warning/30',
    pagado: 'bg-farma-primary bg-opacity-20 text-farma-primary border-farma-primary/30',
    enviado: 'bg-farma-accent bg-opacity-20 text-farma-accent border-farma-accent/30',
    entregado: 'bg-farma-success bg-opacity-20 text-farma-success border-farma-success/30',
    cancelado: 'bg-farma-error bg-opacity-20 text-farma-error border-farma-error/30',
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
        <h2 className="text-xl font-bold text-farma-text">📦 Últimos Pedidos ({orders.length})</h2>
        <button onClick={fetchOrders} className="text-sm text-farma-primary hover:text-farma-secondary transition">🔄 Actualizar</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-farma-muted">
        <table className="min-w-full divide-y divide-farma-muted">
          <thead className="bg-farma-accent bg-opacity-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-farma-text uppercase tracking-wider">Orden / Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-farma-text uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-farma-text uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-farma-text uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-farma-accent hover:bg-opacity-5 transition">
                
                {/* 1. Cliente y Fecha */}
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-farma-text">#{order.numero_orden}</div>
                  <div className="text-sm text-farma-gray">{order.cliente_nombre}</div>
                  <div className="text-xs text-farma-gray/60 mt-1">
                    {new Date(order.fecha).toLocaleDateString()}
                  </div>
                  {/* Si es invitado (cliente_id null), mostramos una etiqueta */}
                  {!order.cliente_id && (
                    <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium bg-farma-accent bg-opacity-10 text-farma-text">
                      Invitado
                    </span>
                  )}
                </td>

                {/* 2. Lista de Productos */}
                <td className="px-6 py-4">
                  <ul className="text-sm text-farma-text space-y-1">
                    {order.detalle_ventas.map((item, idx) => (
                      <li key={idx}>
                        <span className="font-bold">{item.cantidad}x</span> {item.producto?.nombre || 'Producto borrado'}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* 3. Total */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-farma-primary">
                    $ {order.total_final.toLocaleString('es-AR')}
                  </div>
                </td>

                {/* 4. Selector de Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`block w-full text-xs font-bold py-1 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-farma-primary cursor-pointer ${statusColors[order.estado] || 'bg-farma-accent bg-opacity-10'}`}
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
          <div className="p-10 text-center text-farma-gray">
            No hay pedidos registrados todavía.
          </div>
        )}
      </div>
    </div>
  );
}