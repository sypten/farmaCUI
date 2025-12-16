# Solución: Admin Pages Funcionales

## Problema Original
Los usuarios admin se quedaban "atrapados" en la página de login cuando intentaban acceder a `/admin` y `/admin/ventas`. Esto ocurría porque:

1. **Astro server-side session detection** - `supabase.auth.getSession()` no detectaba correctamente la sesión después del login en el cliente
2. **Race condition** - El servidor renderizaba antes de que el cliente recibiera el token de autenticación
3. **SSR vs Cliente mismatch** - La sesión del servidor y del cliente no estaban sincronizadas

## Solución Implementada

### Arquitectura: Mover autenticación al cliente

En lugar de verificar permisos en el servidor (Astro SSR), ahora verificamos en el cliente con React:

```jsx
// AdminGuard.jsx - Verifica permisos en el CLIENTE
const { data: { user } } = await supabase.auth.getUser(); // ✅ API del cliente
```

vs.

```javascript
// ❌ Lo que no funcionaba en Astro
const { data: { session } } = await supabase.auth.getSession(); // ❌ API del servidor
```

### Componentes Creados

#### 1. **AdminGuard.jsx** (src/components/AdminGuard.jsx)
- Wrapper React que protege rutas de admin
- Verifica autenticación usando `supabase.auth.getUser()` (API del cliente)
- Verifica rol en tabla `usuarios_sistema`
- Redirige a `/login` si no autenticado
- Redirige a `/` si no tiene rol admin/superadmin/staff
- Muestra spinner mientras verifica

#### 2. **AdminContent.jsx** (src/components/admin/AdminContent.jsx)
- Componente React que contiene la lógica y UI de admin
- Carga productos y datos en `useEffect`
- Maneja tabla de inventario
- Muestra formulario de agregar productos (solo admin/superadmin)
- Muestra mensaje de "operador" para staff

#### 3. **Actualizado: CartCounter.jsx**
- Ya existía y usa mismo patrón de verificación en cliente
- Comunica cart count con Header.astro

### Páginas Refactorizadas

#### admin/index.astro (Antes: 130 líneas de código Astro/JSX confundido)
```astro
---
import Layout from '../../layouts/Layout.astro';
import AdminGuard from '../../components/AdminGuard.jsx';
import AdminContent from '../../components/admin/AdminContent.jsx';
---

<Layout title="Panel de Control">
  <AdminGuard client:only="react">
    <AdminContent client:only="react" />
  </AdminGuard>
</Layout>
```

Ahora: Clean, limpio, solo una línea de lógica

#### admin/ventas.astro (Antes: Server-side auth checks)
```astro
---
import Layout from '../../layouts/Layout.astro';
import AdminOrderList from '../../components/admin/AdminOrderList.jsx';
import AdminGuard from '../../components/AdminGuard.jsx';
---

<Layout title="Gestión de Ventas - Admin">
  <AdminGuard client:only="react">
    <div class="bg-white min-h-screen">
      <!-- Header y AdminOrderList -->
    </div>
  </AdminGuard>
</Layout>
```

### Colores Actualizados

Ambos componentes de admin ahora usan la paleta FarmaCUI:

- Headers: `farma-primary` (#9504E2)
- Tablas: `farma-text`, `farma-gray`, bordes en `farma-muted`
- Estados de pedidos:
  - Pendiente: `farma-warning` (naranja)
  - Pagado: `farma-primary` (violeta)
  - Enviado: `farma-accent` (lila)
  - Entregado: `farma-success` (verde)
  - Cancelado: `farma-error` (rojo)

## Flujo Ahora

1. Usuario admin hace login en `/login` → Supabase crea sesión en cliente
2. Usuario navega a `/admin` → AdminGuard.jsx ejecuta en cliente
3. AdminGuard verifica `supabase.auth.getUser()` (API del cliente, sí ve la sesión)
4. AdminGuard verifica tabla `usuarios_sistema` para obtener rol
5. ✅ Usuario con rol correcto → renderiza AdminContent.jsx
6. ❌ Usuario sin rol → redirige a `/`
7. ❌ Usuario no autenticado → redirige a `/login`

## Por qué esto funciona

- **`client:only="react"`** - Astro no renderiza en servidor, solo en cliente
- **React `useEffect`** - Se ejecuta en navegador donde Supabase session está disponible
- **No hay SSR mismatch** - Todo ocurre en el cliente donde la sesión es confiable

## Verificación

Para verificar que todo funciona:

1. **Login como usuario admin** (debe tener rol en `usuarios_sistema`)
2. Ir a `/admin` → debe cargar tabla de productos
3. Ir a `/admin/ventas` → debe cargar tabla de pedidos
4. Si tiene rol `admin/superadmin` → muestra formulario de agregar
5. Si tiene rol `staff` → solo lectura + mensaje informativo

## Notas para el futuro

- Todos los componentes ahora verifican auth en el **cliente** (confiable)
- Si necesitas más rutas protegidas, envuelve en `<AdminGuard>`
- La tabla `usuarios_sistema` es la fuente de verdad para roles
- RLS en base de datos también protege los datos (redundancia)
