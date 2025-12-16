import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProductForm from './ProductForm';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  // Al montar, cargamos datos
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('📦 AdminDashboard: Iniciando carga de datos...');
      setLoading(true);
      setError(null);
      
      // 1. Obtener Rol actual
      console.log('👤 AdminDashboard: Obteniendo usuario...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      console.log('🔍 AdminDashboard: Consultando rol en BD...');
      const { data: roleData, error: roleError } = await supabase
        .from('usuarios_sistema')
        .select('rol')
        .eq('id', user.id)
        .single();
      
      if (roleError) {
        console.error('❌ AdminDashboard: Error obteniendo rol:', roleError.message);
        setError(`Error de rol: ${roleError.message}`);
        setLoading(false);
        return;
      }
      
      console.log(`✅ AdminDashboard: Rol obtenido: ${roleData?.rol}`);
      setUserRole(roleData?.rol);

      // 2. Obtener Productos
      console.log('📥 AdminDashboard: Cargando productos...');
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('id, nombre, precio, stock, creado_en, categoria:categorias(nombre), imagenes:imagenes_producto(url)');
      
      if (productsError) {
        console.error('❌ AdminDashboard: Error obteniendo productos:', productsError.message);
        setError(`Error al cargar productos: ${productsError.message}`);
        setLoading(false);
        return;
      }
      
      console.log(`✅ AdminDashboard: ${productsData?.length || 0} productos cargados`);
      setProducts(productsData || []);
      setLoading(false);
      console.log('✅ AdminDashboard: Datos cargados exitosamente');
    } catch (err) {
      console.error('❌ AdminDashboard: Error en fetchData:', err.message);
      setError(`Error: ${err.message || 'Error inesperado'}`);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return;

    // Borrado optimista: Actualizamos la UI antes de que responda el servidor para que se sienta instantáneo
    const backup = [...products];
    setProducts(products.filter(p => p.id !== id));

    const { error } = await supabase.from('productos').delete().eq('id', id);
    
    if (error) {
        alert('Error borrando: ' + error.message);
        setProducts(backup); // Revertimos si falló
    }
  };

  const esAdminTotal = ['admin', 'superadmin'].includes(userRole);

  if (loading) return (
    <div className="p-10 text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farma-primary mx-auto mb-2"></div>
      Cargando inventario...
    </div>
  );

  if (error) return (
    <div className="p-10 bg-red-50 border border-red-200 rounded text-red-700 text-center">
      ⚠️ {error}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* LISTA DE PRODUCTOS */}
      <div className={esAdminTotal ? 'lg:col-span-2' : 'lg:col-span-3'}>
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-farma-text">Inventario</h2>
            <span className="text-sm bg-white px-3 py-1 rounded shadow-sm border border-gray-100">
                Total: <strong>{products.length}</strong>
            </span>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        {esAdminTotal && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-blue-50/50 transition">
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                        <img className="h-10 w-10 object-cover" src={prod.imagenes?.[0]?.url || 'https://placehold.co/50'} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{prod.nombre}</div>
                                        <div className="text-xs text-gray-500">{prod.categoria?.nombre || 'General'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-farma-secondary">$ {prod.precio?.toLocaleString('es-AR')}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${prod.stock === 0 ? 'bg-red-100 text-red-800' : prod.stock < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {prod.stock === 0 ? 'Agotado' : `${prod.stock} u.`}
                                </span>
                            </td>
                            
                            {esAdminTotal && (
                                <td className="px-4 py-3 text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleDelete(prod.id)} 
                                        className="text-gray-400 hover:text-farma-error p-2 hover:bg-red-50 rounded transition"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">No hay productos cargados.</div>
            )}
        </div>
      </div>

      {/* FORMULARIO (Solo si es Admin Total) */}
      {esAdminTotal && (
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24 border border-farma-accent/30">
                <h2 className="text-xl font-bold mb-4 text-farma-primary border-b pb-2">Agregar Nuevo</h2>
                {/* Pasamos fetchData como onSuccess */}
                <ProductForm onSuccess={fetchData} />
            </div>
        </div>
      )}

      {!esAdminTotal && (
         <div className="lg:col-span-1 bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
               👋 Vista de <strong>Operador</strong>.<br/>
               Solo lectura habilitada.
            </p>
         </div>
      )}
    </div>
  );
}