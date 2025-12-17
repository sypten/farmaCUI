import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProductForm from './ProductForm';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  // Estados para controlar el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // --- 1. CARGA INICIAL DE DATOS ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // A) Verificar Usuario y Rol
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No hay usuario autenticado');

      const { data: roleData } = await supabase
        .from('usuarios_sistema')
        .select('rol')
        .eq('id', user.id)
        .single();
      
      setUserRole(roleData?.rol);

      // B) Cargar Productos con relaciones
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categorias(id, nombre),
          imagenes:imagenes_producto(url)
        `)
        .order('creado_en', { ascending: false });
      
      if (productsError) throw productsError;
      
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error cargando datos:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LÓGICA PARA GUARDAR (CREAR O EDITAR) ---
  const handleSaveProduct = async (formData) => {
    try {
      setLoading(true);
      
      // A) Subir Imagen (si es un archivo nuevo)
      let newImageUrl = null;
      if (formData.image instanceof File) {
        const fileName = `${Date.now()}-${formData.image.name.replace(/\s/g, '-')}`;
        
        // 1. Subir al Bucket 'productos' (CORREGIDO AQUÍ)
        const { error: uploadError } = await supabase.storage
          .from('productos') 
          .upload(fileName, formData.image);
        
        if (uploadError) throw uploadError;

        // 2. Obtener URL pública del bucket 'productos' (CORREGIDO AQUÍ)
        const { data: urlData } = supabase.storage
          .from('productos')
          .getPublicUrl(fileName);
          
        newImageUrl = urlData.publicUrl;
      }

      // B) Preparar datos para la tabla 'productos'
      const productData = {
        nombre: formData.name,
        descripcion: formData.description,
        precio: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoria_id: formData.category_id,
      };

      let productId = productToEdit?.id;

      // C) Insertar o Actualizar en la BD
      if (productToEdit) {
        // --- UPDATE ---
        const { error: updateError } = await supabase
          .from('productos')
          .update(productData)
          .eq('id', productId);
          
        if (updateError) throw updateError;
      } else {
        // --- INSERT ---
        const { data: newProd, error: insertError } = await supabase
          .from('productos')
          .insert([productData])
          .select()
          .single();
          
        if (insertError) throw insertError;
        productId = newProd.id;
      }

      // D) Registrar la imagen en la tabla 'imagenes_producto'
      if (newImageUrl && productId) {
        const { error: imgError } = await supabase
          .from('imagenes_producto')
          .insert([{
            producto_id: productId,
            url: newImageUrl
          }]);
          
        if (imgError) console.warn('Error guardando referencia de imagen:', imgError);
      }

      // E) Finalizar
      setIsModalOpen(false);
      await fetchData(); 
      alert('Producto guardado correctamente');

    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ELIMINAR PRODUCTO ---
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      // Borrado optimista
      const backup = [...products];
      setProducts(products.filter(p => p.id !== id));

      const { error } = await supabase.from('productos').delete().eq('id', id);
      
      if (error) throw error;
    } catch (err) {
      alert('Error eliminando: ' + err.message);
      fetchData(); // Revertir cambios
    }
  };

  // --- HANDLERS DEL MODAL ---
  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const esAdminTotal = ['admin', 'superadmin'].includes(userRole);

  if (loading && products.length === 0) {
    return <div className="p-10 text-center text-gray-500">Cargando sistema...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
          <p className="text-sm text-gray-500">Gestión de {products.length} productos</p>
        </div>
        
        {esAdminTotal && (
          <button 
            onClick={handleOpenCreate}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} /> Nuevo Producto
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
           ⚠️ {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                {esAdminTotal && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                        <img 
                          className="h-10 w-10 object-cover" 
                          src={prod.imagenes?.[0]?.url || 'https://placehold.co/50'} 
                          alt={prod.nombre} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{prod.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                    ${prod.precio?.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${prod.stock === 0 ? 'bg-red-100 text-red-800' : 
                        prod.stock < 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {prod.stock === 0 ? 'Agotado' : `${prod.stock} u.`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prod.categoria?.nombre || '-'}
                  </td>
                  
                  {esAdminTotal && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(prod)}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id)} 
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-400 text-sm">No hay productos en el inventario.</div>
          )}
        </div>
      </div>

      {/* Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          {/* CAMBIO CLAVE: "h-[85vh]" en lugar de "h-auto". 
              Esto fuerza una altura fija y activa el scroll del ProductForm.
          */}
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-10 h-[85vh] flex flex-col">
            <ProductForm 
              productToEdit={productToEdit} 
              onSave={handleSaveProduct} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}

      {!esAdminTotal && !loading && (
         <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
            <p className="text-sm text-blue-800">
               👋 Vista de <strong>Operador</strong>. Solo lectura.
            </p>
         </div>
      )}
    </div>
  );
}