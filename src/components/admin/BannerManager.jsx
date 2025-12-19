import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Plus, Upload, Save, X } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Formulario vacío
  const initialForm = {
    titulo: '', subtitulo: '', link: '', orden: 0,
    clase_grid: 'md:col-span-1 md:row-span-1', // Tamaño Normal por defecto
    image: null
  };
  const [formData, setFormData] = useState(initialForm);

  // Opciones de tamaños para el Grid
  const gridOptions = [
    { label: 'Normal (Cuadrado 1x1)', value: 'md:col-span-1 md:row-span-1' },
    { label: 'Gigante (Cuadrado 2x2)', value: 'md:col-span-2 md:row-span-2' },
    { label: 'Panorámico (Horizontal 2x1)', value: 'md:col-span-2 md:row-span-1' },
    { label: 'Torre (Vertical 1x2)', value: 'md:col-span-1 md:row-span-2' },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await supabase.from('banners').select('*').order('orden', { ascending: true });
    setBanners(data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      // 1. Si hay imagen nueva, subirla al Storage
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('banners')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
      }

      // 2. Guardar en Base de Datos
      const { error: dbError } = await supabase.from('banners').insert({
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        link: formData.link,
        orden: formData.orden,
        clase_grid: formData.clase_grid,
        imagen_url: imageUrl // Guardamos la URL de Supabase
      });

      if (dbError) throw dbError;

      alert('¡Banner creado!');
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchBanners();

    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Borrar este banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    fetchBanners();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Banners</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-farma-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-farma-secondary"
        >
          <Plus size={20} /> Nuevo Banner
        </button>
      </div>

      {/* Lista de Banners Existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative group">
             <img src={banner.imagen_url} alt={banner.titulo} className="h-32 w-full object-cover" />
             <div className="p-3">
                <h3 className="font-bold text-gray-800">{banner.titulo}</h3>
                <p className="text-sm text-gray-500">{banner.subtitulo}</p>
                <div className="mt-2 text-xs bg-gray-100 p-1 rounded inline-block">
                    Orden: {banner.orden}
                </div>
             </div>
             <button 
                onClick={() => handleDelete(banner.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
             >
                <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>

      {/* MODAL DE CREACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Nuevo Banner</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Imagen */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                    <input 
                        type="file" accept="image/*" required 
                        onChange={e => setFormData({...formData, image: e.target.files[0]})}
                        className="hidden" id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-farma-primary font-bold">
                            {formData.image ? formData.image.name : 'Click para subir imagen'}
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input 
                        placeholder="Título Principal" required
                        value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})}
                        className="border p-2 rounded"
                    />
                    <input 
                        placeholder="Subtítulo" 
                        value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <input 
                        placeholder="Link (Ej: /categoria/ofertas)" required
                        value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                        className="border p-2 rounded"
                    />
                    {/* Reemplaza el input de "Orden" por este bloque: */}
                    <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-gray-700">
                        ⚡ Prioridad de Visualización
                        </label>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.orden === 0 ? 'bg-farma-primary text-white' : 
                        formData.orden <= 5 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {formData.orden === 0 ? '🔥 Lo primero que se ve' : 
                        formData.orden >= 10 ? '💤 Al final de todo' : 
                        `Prioridad Alta (Nivel ${10 - formData.orden})`}
                        </span>
                    </div>

                    <div className="relative flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-medium">Normal</span>
                        
                        <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        step="1"
                        /* TRUCO UX: Invertimos el valor. 
                            Si el usuario desliza a la derecha (10 de "Fuerza"), 
                            guardamos 0 en la BD (Primer lugar). */
                        value={10 - (formData.orden > 10 ? 10 : formData.orden)} 
                        onChange={e => {
                            const fuerza = parseInt(e.target.value);
                            // Convertimos "Fuerza" (0 a 10) en "Orden" (10 a 0)
                            setFormData({...formData, orden: 10 - fuerza});
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-farma-primary hover:accent-farma-secondary transition-all"
                        />
                        
                        <span className="text-xs text-farma-primary font-bold">¡Destacar!</span>
                    </div>
                    </div>
                </div>

                {/* Selector de Tamaño */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tamaño en el Grid</label>
                    <select 
                        value={formData.clase_grid}
                        onChange={e => setFormData({...formData, clase_grid: e.target.value})}
                        className="w-full border p-2 rounded bg-white"
                    >
                        {gridOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <button 
                    type="submit" disabled={uploading}
                    className="w-full bg-farma-primary text-white py-3 rounded-lg font-bold hover:bg-farma-secondary flex justify-center items-center gap-2"
                >
                    {uploading ? 'Subiendo...' : <><Save size={18} /> Guardar Banner</>}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}