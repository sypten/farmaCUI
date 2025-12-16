import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: '', 
    slug: '', 
    precio: 0, 
    stock: 0, 
    categoria_id: 1, 
    descripcion: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generar slug al escribir el nombre (para que la URL sea bonita)
    if (name === 'nombre') {
      setFormData(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Guardar los datos básicos del Producto en la tabla 'productos'
      const { data: producto, error: prodError } = await supabase
        .from('productos')
        .insert([{
          nombre: formData.nombre,
          slug: formData.slug,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          categoria_id: parseInt(formData.categoria_id),
          descripcion: formData.descripcion
        }])
        .select()
        .single(); // Pedimos que nos devuelva el objeto creado (necesitamos su ID)

      if (prodError) throw prodError;

      // 2. Subir Imagen (si el usuario seleccionó una)
      if (imageFile) {
        // Generamos nombre único: ID-Producto + NumeroRandom.ext
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${producto.id}-${Math.floor(Math.random()*1000)}.${fileExt}`;
        const filePath = `${fileName}`;

        // A) Subir al Bucket 'productos' (Supabase Storage)
        const { error: uploadError } = await supabase.storage
          .from('productos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // B) Obtener la URL pública para mostrarla en la web
        const { data: { publicUrl } } = supabase.storage
          .from('productos')
          .getPublicUrl(filePath);

        // C) Guardar esa URL en la tabla 'imagenes_producto'
        await supabase.from('imagenes_producto').insert({
          producto_id: producto.id,
          url: publicUrl,
          orden: 0
        });
      }

      alert('¡Producto creado con éxito!');
      window.location.reload(); // Recargamos para ver el producto nuevo en la lista

    } catch (error) {
      console.error(error);
      alert('Error al crear: ' + (error.message || error.details));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-farma-muted">
      <h2 className="text-xl font-bold mb-6 text-farma-text border-b pb-2">Nuevo Producto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre y Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-farma-text">Nombre</label>
            <input 
              name="nombre" 
              type="text" 
              required
              className="mt-1 block w-full rounded border-farma-muted shadow-sm p-2 border"
              onChange={handleChange}
              value={formData.nombre}
              placeholder="Ej: Ibuprofeno 600mg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farma-text">Slug (URL automática)</label>
            <input 
              name="slug" 
              type="text" 
              required
              className="mt-1 block w-full rounded border-farma-muted bg-white shadow-sm p-2 border text-farma-text"
              onChange={handleChange}
              value={formData.slug}
              readOnly
            />
          </div>
        </div>

        {/* Precios y Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-farma-text">Precio ($)</label>
            <input name="precio" type="number" required className="mt-1 block w-full rounded border p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-farma-text">Stock</label>
            <input name="stock" type="number" required className="mt-1 block w-full rounded border p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-farma-text">Categoría ID</label>
            <input name="categoria_id" type="number" defaultValue={1} className="mt-1 block w-full rounded border p-2" onChange={handleChange} />
          </div>
        </div>

        {/* Descripción */}
        <div>
           <label className="block text-sm font-medium text-farma-text">Descripción</label>
           <textarea name="descripcion" rows="3" className="mt-1 block w-full rounded border p-2" onChange={handleChange}></textarea>
        </div>

        {/* Subida de Imagen */}
        <div>
          <label className="block text-sm font-medium text-farma-text">Imagen Principal</label>
          <input 
            type="file" 
            accept="image/*"
            className="mt-1 block w-full text-sm text-farma-gray file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-farma-accent file:text-farma-primary hover:file:bg-farma-accent hover:file:bg-opacity-50"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 px-4 rounded text-white font-bold transition-colors ${loading ? 'bg-farma-gray cursor-not-allowed' : 'bg-farma-primary hover:bg-farma-secondary'}`}
        >
          {loading ? 'Guardando...' : 'Crear Producto'}
        </button>

      </form>
    </div>
  );
}