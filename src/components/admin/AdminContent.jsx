import { useEffect, useState } from 'react';
import ProductForm from './ProductForm.jsx';
import { supabase } from '../../lib/supabase';

export default function AdminContent() {
  const [usuario, setUsuario] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        
        // 2. Obtener rol
        const { data: usuarioData } = await supabase
          .from('usuarios_sistema')
          .select('rol')
          .eq('id', user.id)
          .single();

        setUsuario(usuarioData);

        // 3. Cargar productos
        const { data: productsData } = await supabase
          .from('productos')
          .select('*, categoria:categorias(nombre), imagenes:imagenes_producto(url)')
          .order('creado_en', { ascending: false });

        setProducts(productsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      await supabase.from('productos').delete().eq('id', id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar el producto');
    }
  };

  const esAdminTotal = usuario && ['admin', 'superadmin'].includes(usuario.rol);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farma-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white shadow mb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h1 className="text-xl font-bold text-farma-primary">
                Panel {usuario?.rol === 'staff' ? 'Operador' : 'Admin'}
              </h1>
              <p className="text-xs text-farma-gray uppercase tracking-wide">Rol: {usuario?.rol}</p>
            </div>
          </div>

          <nav className="flex gap-6 text-sm">
            <a href="/admin" className="text-farma-primary font-bold border-b-2 border-farma-primary pb-1 px-2">
              📦 Productos
            </a>
            <a href="/admin/ventas" className="text-farma-gray hover:text-farma-primary transition pb-1 px-2">
              💰 Ventas
            </a>
            <a href="/" className="text-farma-gray hover:text-farma-secondary ml-4 border-l border-farma-muted pl-4">
              Ir a la tienda ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className={`grid grid-cols-1 ${esAdminTotal ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8 items-start`}>
          
          {/* Inventario */}
          <div className={esAdminTotal ? 'lg:col-span-2' : ''}>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-farma-text">Inventario</h2>
              <span className="text-sm bg-farma-accent bg-opacity-10 px-3 py-1 rounded shadow-sm">
                Total: <strong>{products.length}</strong>
              </span>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-farma-muted">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-farma-muted">
                  <thead className="bg-farma-accent bg-opacity-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-farma-text uppercase">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-farma-text uppercase">Precio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-farma-text uppercase">Stock</th>
                      {esAdminTotal && (
                        <th className="px-4 py-3 text-right text-xs font-medium text-farma-text uppercase">Acción</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-farma-muted">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-farma-accent hover:bg-opacity-5 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white border border-farma-muted rounded overflow-hidden flex-shrink-0">
                              <img
                                className="h-10 w-10 object-cover"
                                src={prod.imagenes?.[0]?.url || 'https://placehold.co/50'}
                                alt={prod.nombre}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-farma-text">{prod.nombre}</div>
                              <div className="text-xs text-farma-gray">{prod.categoria?.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-farma-primary">
                          $ {prod.precio?.toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              prod.stock === 0
                                ? 'bg-farma-error bg-opacity-20 text-farma-error'
                                : prod.stock < 5
                                ? 'bg-farma-warning bg-opacity-20 text-farma-warning'
                                : 'bg-farma-success bg-opacity-20 text-farma-success'
                            }`}
                          >
                            {prod.stock === 0 ? 'Agotado' : `${prod.stock} u.`}
                          </span>
                        </td>

                        {esAdminTotal && (
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="text-farma-error hover:bg-farma-error hover:bg-opacity-10 p-2 rounded transition"
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
              </div>
            </div>
          </div>

          {/* Formulario de Nuevo Producto */}
          {esAdminTotal && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow sticky top-24 border border-farma-accent/30">
                <h2 className="text-xl font-bold mb-4 text-farma-primary border-b pb-2">Agregar Nuevo</h2>
                <ProductForm />
              </div>
            </div>
          )}

          {/* Mensaje para Staff */}
          {!esAdminTotal && (
            <div className="bg-farma-accent bg-opacity-10 border-l-4 border-farma-primary p-4">
              <p className="text-farma-primary">
                👋 Hola <strong>Operador</strong>. Tienes acceso de <strong>lectura</strong>. Para editar el inventario contacta a un Administrador.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
