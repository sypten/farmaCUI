import { supabase } from './supabase';

export async function createOrder(items, buyerInfo, total) {
  try {
    // buyerInfo esperará: { id: 'uuid' | null, name: '...', email: '...' }
    
    const { data, error } = await supabase.rpc('crear_orden_compra', {
      p_cliente_id: buyerInfo.id, // Puede ser NULL si es invitado
      p_cliente_nombre: buyerInfo.name, // Este sí es obligatorio para saber a quién entregar
      p_total: total,
      p_detalles: items 
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.message);

    return { success: true, orderId: data.order_id };

  } catch (error) {
    console.error('Error procesando orden:', error);
    const msg = error.message.replace('P0001:', '').trim(); 
    return { success: false, error: msg };
  }
}