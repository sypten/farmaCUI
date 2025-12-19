import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AddressList({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Estado para nueva dirección
  const [newAddress, setNewAddress] = useState({
    alias: '', calle_numero: '', ciudad: 'Salta', codigo_postal: ''
  });

  // Cargar direcciones
  const fetchAddresses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('direcciones_clientes')
      .select('*')
      .eq('cliente_id', userId)
      .order('id', { ascending: false });
    setAddresses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  // Guardar dirección
  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('direcciones_clientes').insert({
      cliente_id: userId,
      alias: newAddress.alias,
      calle_numero: newAddress.calle_numero,
      ciudad: newAddress.ciudad,
      provincia: 'Salta', // Hardcodeado por ahora o hazlo dinámico
      codigo_postal: newAddress.codigo_postal
    });

    if (!error) {
      setNewAddress({ alias: '', calle_numero: '', ciudad: 'Salta', codigo_postal: '' });
      setShowForm(false);
      fetchAddresses();
    } else {
      alert('Error guardando: ' + error.message);
    }
  };

  // Borrar dirección
  const handleDelete = async (id) => {
    if(!confirm('¿Borrar esta dirección?')) return;
    await supabase.from('direcciones_clientes').delete().eq('id', id);
    fetchAddresses();
  };

  if (loading) return <div className="text-sm text-gray-500">Cargando direcciones...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📍 Mis Direcciones</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-farma-primary font-bold hover:underline"
        >
          {showForm ? 'Cancelar' : '+ Nueva'}
        </button>
      </div>

      {/* Formulario Agregar */}
      {showForm && (
        <form onSubmit={handleSave} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 gap-3">
            <input 
              placeholder="Alias (Ej: Casa, Trabajo)" 
              value={newAddress.alias}
              onChange={e => setNewAddress({...newAddress, alias: e.target.value})}
              className="p-2 border rounded text-sm"
              required
            />
            <input 
              placeholder="Calle y Número" 
              value={newAddress.calle_numero}
              onChange={e => setNewAddress({...newAddress, calle_numero: e.target.value})}
              className="p-2 border rounded text-sm"
              required
            />
            <div className="flex gap-2">
                <input 
                placeholder="Ciudad" 
                value={newAddress.ciudad}
                onChange={e => setNewAddress({...newAddress, ciudad: e.target.value})}
                className="p-2 border rounded text-sm w-2/3"
                required
                />
                <input 
                placeholder="CP" 
                value={newAddress.codigo_postal}
                onChange={e => setNewAddress({...newAddress, codigo_postal: e.target.value})}
                className="p-2 border rounded text-sm w-1/3"
                required
                />
            </div>
            <button type="submit" className="bg-farma-primary text-white py-2 rounded text-sm font-bold hover:bg-farma-secondary">
              Guardar Dirección
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      {addresses.length === 0 ? (
        <p className="text-gray-400 text-sm text-center italic">No tienes direcciones guardadas.</p>
      ) : (
        <ul className="space-y-3">
          {addresses.map(addr => (
            <li key={addr.id} className="border border-farma-muted rounded-lg p-3 relative hover:bg-farma-accent hover:bg-opacity-5 transition">
              <div className="font-bold text-farma-text text-sm flex items-center gap-2">
                 <span>🏠</span> {addr.alias || 'Dirección'}
              </div>
              <p className="text-gray-600 text-sm mt-1">{addr.calle_numero}</p>
              <p className="text-gray-400 text-xs">{addr.ciudad}, CP {addr.codigo_postal}</p>
              
              <button 
                onClick={() => handleDelete(addr.id)}
                className="absolute top-3 right-3 text-gray-300 hover:text-farma-error"
                title="Eliminar"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}