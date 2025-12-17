import React, { useState, useEffect } from 'react';
import { Save, X, Upload, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProductForm({ productToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null,
  });
  
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingCats, setLoadingCats] = useState(true);

  // 1. Cargar Categorías
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre')
          .order('nombre');
          
        if (error) throw error;
        setCategories(data || []);
        
        if (!productToEdit && data && data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  // 2. Cargar datos si es edición
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || productToEdit.nombre || '',
        description: productToEdit.description || '',
        price: productToEdit.price || productToEdit.precio || '',
        stock: productToEdit.stock || '',
        category_id: productToEdit.categoria_id || productToEdit.categoria?.id || '', 
        image: productToEdit.image || null,
      });
      setImagePreview(productToEdit.image || productToEdit.imagenes?.[0]?.url || null);
    } else {
      setFormData(prev => ({
        name: '', description: '', price: '', stock: '', 
        category_id: categories.length > 0 ? categories[0].id : '', 
        image: null
      }));
      setImagePreview(null);
    }
  }, [productToEdit, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* 1. HEADER FIJO */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">
          {productToEdit ? 'Editar Producto' : 'Crear Producto'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 2. AREA SCROLLABLE (Inputs) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {/* Usamos el ID para conectar el botón de guardar que está afuera */}
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Nombre del Producto *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Ej. Ibuprofeno 400mg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Precio *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Stock *</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Categoría</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              disabled={loadingCats}
            >
              {loadingCats ? (
                  <option>Cargando...</option>
              ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Detalles opcionales..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-sm font-semibold text-gray-700">Imagen</label>
            <div className="flex items-center gap-4 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <div className="h-14 w-14 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                      <Upload size={14} className="mr-1.5"/> Elegir archivo
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Formatos: JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* 3. FOOTER FIJO (Botones siempre visibles) */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
        <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
        >
            Cancelar
        </button>
        {/* El atributo 'form' vincula este botón con el formulario de arriba */}
        <button 
            type="submit" 
            form="product-form"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
            <Save size={16} /> 
            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </div>

    </div>
  );
}