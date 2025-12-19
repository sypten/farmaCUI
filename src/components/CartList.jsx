import { useStore } from '@nanostores/react';
import { cart, removeCartItem, decreaseCartItem, addCartItem, clearCart } from '../store/cart';
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

  // Función auxiliar para crear el texto bonito de WhatsApp
  const buildWhatsAppMessage = (orderId, buyer, items, total) => {
    let text = `👋 *¡Hola! Quiero confirmar mi nuevo pedido.*\n\n`;
    text += `🆔 *Orden:* #${orderId}\n`;
    text += `👤 *Cliente:* ${buyer.name}\n`;
    text += `📧 *Email:* ${buyer.email}\n\n`;
    
    text += `🛒 *Detalle del pedido:*\n`;
    items.forEach(item => {
      text += `- ${item.quantity}x ${item.name} ($${item.price})\n`;
    });
    
    text += `\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*`;
    
    return encodeURIComponent(text); // Importante para que funcione el link
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
        // 1. Número de WhatsApp de la Farmacia (Ej: 549 + característica + numero)
        const PHONE_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

        if (!PHONE_NUMBER) {
          console.error("Falta configurar el número de WhatsApp en el .env");
          alert("Pedido confirmado, pero no pudimos abrir WhatsApp. Contactanos por favor.");
          window.location.href = '/';
          return;
        }

        // 2. Generar el link
        const message = buildWhatsAppMessage(result.orderId, buyerInfo, items, total);
        const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${message}`;

        alert(`¡Pedido #${result.orderId} creado! Te redirigimos a WhatsApp para finalizar.`);

        // 4. Abrir WhatsApp en una pestaña nueva
        window.open(whatsappUrl, '_blank');

        // 5. Redirigir al home en la ventana actual
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
  const decrease = (id) => decreaseCartItem(id);
  const remove = (id) => { if(confirm('¿Quitar?')) removeCartItem(id); };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-farma-gray text-xl mb-4">Tu carrito está vacío 😢</p>
        <a href="/" className="bg-farma-primary text-white px-6 py-2 rounded hover:bg-farma-secondary transition">Ir a comprar</a>
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
              <img src={item.image || 'https://placehold.co/100'} alt={item.name} className="w-20 h-20 object-contain bg-white border border-farma-muted rounded"/>
              <div className="flex-1">
                <h3 className="font-bold text-farma-text">{item.name}</h3>
                <div className="text-farma-primary font-bold mt-1">$ {item.price?.toLocaleString('es-AR')}</div>
              </div>
              
              
              <div className="flex items-center gap-3">
                {/* BOTÓN RESTAR (NUEVO) */}
                <button 
                  onClick={() => decrease(item.id)}
                  className="w-8 h-8 bg-gray-100 rounded-full text-blue-600 font-bold hover:bg-blue-200 flex items-center justify-center disabled:opacity-50"
                  disabled={item.quantity <= 1}>-</button>
                <span className="font-bold text-farma-text">x{item.quantity}</span>
                {/* BOTÓN SUMAR */}
                <button onClick={() => increase(item)} className="w-8 h-8 bg-farma-accent rounded-full text-farma-primary font-bold">+</button>
              </div>
              <button onClick={() => remove(item.id)} className="text-farma-error hover:text-farma-error p-2">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* RESUMEN Y FORMULARIO (Derecha) */}
      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow sticky top-24">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-farma-text">Resumen</h2>
          <div className="flex justify-between mb-2 text-farma-gray"><span>Subtotal</span><span>$ {total.toLocaleString('es-AR')}</span></div>
          <div className="flex justify-between text-2xl font-bold text-farma-text mb-6"><span>Total</span><span>$ {total.toLocaleString('es-AR')}</span></div>

          {/* LÓGICA DE VISUALIZACIÓN */}
          {!showGuestForm ? (
            // VISTA 1: Botón Inicial
            <div className="space-y-3">
                <button 
                    onClick={initCheckout}
                    disabled={processing}
                    className="w-full py-3 bg-farma-success hover:bg-farma-successHover text-white rounded-lg font-bold transition shadow-lg text-lg"
                >
                    Continuar Compra
                </button>
                <p className="text-center text-sm text-farma-gray">
                    Se te pedirá iniciar sesión o continuar como invitado.
                </p>
            </div>
          ) : (
            // VISTA 2: Formulario Invitado
            <form onSubmit={handleCheckout} className="animate-fade-in space-y-4 bg-white p-4 rounded border border-farma-primary">
                <div className="text-sm text-farma-primary font-semibold mb-2">Comprando como Invitado</div>
                
                <div>
                    <label className="block text-sm text-farma-text mb-1">Nombre Completo</label>
                    <input 
                        type="text" name="name" required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-farma-primary outline-none"
                        placeholder="Juan Pérez"
                        onChange={handleGuestChange}
                    />
                </div>
                <div>
                    <label className="block text-sm text-farma-text mb-1">Email</label>
                    <input 
                        type="email" name="email" required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-farma-primary outline-none"
                        placeholder="juan@email.com"
                        onChange={handleGuestChange}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-farma-success hover:bg-farma-successHover text-white rounded-lg font-bold transition shadow-lg text-lg mt-2"
                >
                    {processing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
                
                <div className="text-center mt-2">
                    <a href="/login" className="text-sm text-farma-primary hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
                </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}