import { useStore } from '@nanostores/react';
import { cart, removeCartItem, addCartItem, clearCart } from '../store/cart';
import { createOrder } from '../lib/orders';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function CartList() {
  const cartItems = useStore(cart);
  const [items, setItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // Estado para manejar si mostramos el formulario de invitado
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestData, setGuestData] = useState({ name: '', email: '' });

  useEffect(() => {
    const values = Object.values(cartItems).map(item => JSON.parse(item));
    setItems(values);
  }, [cartItems]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Manejar inputs del formulario invitado
  const handleGuestChange = (e) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  // --- LÓGICA DE COMPRA UNIFICADA ---
  const handleCheckout = async (e) => {
    if(e) e.preventDefault();
    setProcessing(true);

    try {
      // 1. Intentamos obtener usuario logueado
      const { data: { user } } = await supabase.auth.getUser();
      let buyerInfo = {};

      if (user) {
        // A) ES CLIENTE REGISTRADO
        buyerInfo = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email,
          email: user.email
        };
      } else {
        // B) ES INVITADO (Verificamos que haya llenado el formulario)
        if (!guestData.name || !guestData.email) {
            alert("Por favor completa tu nombre y email para el pedido.");
            setProcessing(false);
            return;
        }
        buyerInfo = {
          id: null, // ID nulo para invitados
          name: guestData.name,
          email: guestData.email
        };
      }

      // 2. Procesar Orden
      const result = await createOrder(items, buyerInfo, total);

      if (result.success) {
        clearCart();
        alert(`¡Gracias por tu compra, ${buyerInfo.name}! 🎉\nOrden #${result.orderId}\nTe enviamos el detalle a ${buyerInfo.email}`);
        window.location.href = '/'; 
      } else {
        alert("Error: " + result.error);
      }
      
    } catch (err) {
      console.error(err);
      alert("Error inesperado procesando la compra.");
    } finally {
      setProcessing(false);
    }
  };

  // Botón inicial: Decide si comprar directo o mostrar form
  const initCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        handleCheckout(); // Si ya tiene login, compra directo
    } else {
        setShowGuestForm(true); // Si no, despliega el formulario
    }
  }

  const increase = (item) => addCartItem(item);
  const remove = (id) => { if(confirm('¿Quitar?')) removeCartItem(id); };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-xl mb-4">Tu carrito está vacío 😢</p>
        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Ir a comprar</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LISTA DE PRODUCTOS (Izquierda) */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="flex items-center p-4 border-b last:border-b-0 gap-4">
              <img src={item.image || 'https://placehold.co/100'} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded"/>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <div className="text-orange-500 font-bold mt-1">$ {item.price?.toLocaleString('es-AR')}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-700">x{item.quantity}</span>
                <button onClick={() => increase(item)} className="w-8 h-8 bg-gray-100 rounded-full text-blue-600 font-bold">+</button>
              </div>
              <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 p-2">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* RESUMEN Y FORMULARIO (Derecha) */}
      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow sticky top-24">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen</h2>
          <div className="flex justify-between mb-2 text-gray-600"><span>Subtotal</span><span>$ {total.toLocaleString('es-AR')}</span></div>
          <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6"><span>Total</span><span>$ {total.toLocaleString('es-AR')}</span></div>

          {/* LÓGICA DE VISUALIZACIÓN */}
          {!showGuestForm ? (
            // VISTA 1: Botón Inicial
            <div className="space-y-3">
                <button 
                    onClick={initCheckout}
                    disabled={processing}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition shadow-lg text-lg"
                >
                    Continuar Compra
                </button>
                <p className="text-center text-sm text-gray-500">
                    Se te pedirá iniciar sesión o continuar como invitado.
                </p>
            </div>
          ) : (
            // VISTA 2: Formulario Invitado
            <form onSubmit={handleCheckout} className="animate-fade-in space-y-4 bg-gray-50 p-4 rounded border border-blue-100">
                <div className="text-sm text-blue-800 font-semibold mb-2">Comprando como Invitado</div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                        type="text" name="name" required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Juan Pérez"
                        onChange={handleGuestChange}
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" name="email" required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="juan@email.com"
                        onChange={handleGuestChange}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition shadow-lg text-lg mt-2"
                >
                    {processing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
                
                <div className="text-center mt-2">
                    <a href="/login" className="text-sm text-blue-600 hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
                </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}