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