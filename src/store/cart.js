import { persistentMap } from '@nanostores/persistent';

// 1. Creamos el almacén (Store)
// Usamos persistentMap para que se guarde en localStorage automáticamente.
// La clave 'farmacui-cart' es como se verá en el navegador.
export const cart = persistentMap('farmacui-cart', {});

/**
 * Estructura de datos:
 * {
 * 'id_producto_1': { id, nombre, precio, imagen, cantidad: 2 },
 * 'id_producto_2': { id, nombre, precio, imagen, cantidad: 1 },
 * }
 */

// 2. Función para agregar productos
export function addCartItem({ id, name, price, image, slug }) {
  const existingEntry = cart.get()[id];
  
  if (existingEntry) {
    // Si ya existe, le parseamos la info y sumamos 1
    // (localStorage guarda todo como texto, por eso JSON.parse/stringify)
    const item = JSON.parse(existingEntry);
    item.quantity += 1;
    cart.setKey(id, JSON.stringify(item));
  } else {
    // Si es nuevo, lo creamos con cantidad 1
    cart.setKey(id, JSON.stringify({
      id,
      name,
      price,
      image,
      slug,
      quantity: 1
    }));
  }
}

// 3. Función para remover un item (para el futuro)
export function removeCartItem(id) {
  cart.setKey(id, undefined); // undefined borra la clave del mapa
}

// 4. Función para limpiar todo (al comprar)
export function clearCart() {
  cart.set({});
}

// src/store/cart.js

// ... (tus otras funciones addCartItem, removeCartItem, etc.)

export function decreaseCartItem(id) {
  const existing = cart.get()[id];
  if (existing) {
    const item = JSON.parse(existing);
    if (item.quantity > 1) {
      // Si hay más de 1, restamos
      item.quantity -= 1;
      cart.setKey(id, JSON.stringify(item));
    } else {
      // Opcional: Si llega a 1 y restan, ¿lo borramos o no hacemos nada?
      // Por seguridad UX, mejor dejarlo en 1 y que usen el botón de basura para borrar.
    }
  }
}