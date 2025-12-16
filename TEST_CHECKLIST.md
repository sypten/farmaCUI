# 🧪 TEST CHECKLIST - Admin Pages Fix

## Pre-requisitos
- [ ] Usuarios admin/superadmin/staff deben estar registrados en tabla `usuarios_sistema` con su rol
- [ ] Verificar que Supabase Auth está funcionando
- [ ] Build limpio sin errores de compilación

---

## ✅ Test Suite 1: Admin User Flow

### Login and Access
- [ ] Login con email de usuario admin
- [ ] Sesión se crea exitosamente
- [ ] Redirigir a / o dashboard (depende tu lógica)

### Navigation to /admin
- [ ] Click "ir a admin" o navegar manualmente a `/admin`
- [ ] Spinner aparece por ~1 segundo ("Verificando permisos...")
- [ ] Tabla de productos carga correctamente
- [ ] Pueden ver: nombre, precio, stock de cada producto

### Product Management
- [ ] Pueden ver formulario "Agregar Nuevo" a la derecha
- [ ] Pueden rellenar campos: Nombre, Precio, Stock, Descripción, Categoría
- [ ] Botón "Guardar" funciona
- [ ] Nuevo producto aparece en tabla
- [ ] Botón 🗑️ (eliminar) aparece en tabla
- [ ] Al hacer click, pide confirmación
- [ ] Producto se elimina de tabla

### Navigation to /admin/ventas
- [ ] Click en tab "💰 Ventas"
- [ ] Tabla de pedidos carga correctamente
- [ ] Pueden ver: Orden #, Cliente, Productos, Total, Estado
- [ ] Pueden cambiar estado (Pendiente → Pagado, etc.)
- [ ] Los cambios se guardan en BD

---

## ✅ Test Suite 2: Staff User Flow

### Login and Access
- [ ] Login con email de usuario staff
- [ ] Sesión se crea exitosamente

### Navigation to /admin
- [ ] Redirigir a `/admin` exitosamente
- [ ] Tabla de productos carga correctamente
- [ ] **IMPORTANTE**: Botón 🗑️ NO debe aparecer
- [ ] **IMPORTANTE**: Formulario "Agregar Nuevo" NO debe aparecer
- [ ] **IMPORTANTE**: Mensaje aparece: "👋 Hola Operador. Tienes acceso de lectura..."

### Navigation to /admin/ventas
- [ ] Pueden ver tabla de pedidos
- [ ] Pueden cambiar estado (si RLS permite)

---

## ✅ Test Suite 3: Regular User Flow

### Login and Access
- [ ] Login con email de cliente regular (no admin/staff)
- [ ] Sesión se crea exitosamente

### Try to Access Admin
- [ ] Navegar a `/admin`
- [ ] **DEBE redirigir a / inmediatamente**
- [ ] **NO debe mostrar tabla o spinner**

### Try to Access Ventas
- [ ] Navegar a `/admin/ventas`
- [ ] **DEBE redirigir a / inmediatamente**

---

## ✅ Test Suite 4: Not Logged In User Flow

### Try to Access Admin
- [ ] Sin estar logueado, navegar a `/admin`
- [ ] Spinner aparece por ~1 segundo
- [ ] **DEBE redirigir a /login**

### Try to Access Ventas
- [ ] Sin estar logueado, navegar a `/admin/ventas`
- [ ] **DEBE redirigir a /login**

---

## ✅ Test Suite 5: UI/Colors Validation

### Color Scheme
- [ ] Header: Violeta primario (farma-primary)
- [ ] Tabla headers: Fondo violeta suave (farma-accent)
- [ ] Texto: Gris oscuro (farma-text)
- [ ] Bordes: Gris suave (farma-muted)

### Stock Colors (AdminContent)
- [ ] Agotado: Rojo (farma-error)
- [ ] Bajo (<5): Naranja (farma-warning)
- [ ] Normal: Verde (farma-success)

### Order Status Colors (AdminOrderList)
- [ ] Pendiente: Naranja (farma-warning)
- [ ] Pagado: Violeta (farma-primary)
- [ ] Enviado: Lila (farma-accent)
- [ ] Entregado: Verde (farma-success)
- [ ] Cancelado: Rojo (farma-error)

---

## ✅ Test Suite 6: Edge Cases

### Session Refresh
- [ ] Login como admin
- [ ] Refrescar página (F5) en `/admin`
- [ ] **NO debe perder permisos**
- [ ] Tabla debe cargar sin problemas

### Multiple Tabs
- [ ] Abrir `/admin` en tab 1
- [ ] Abrir `/admin/ventas` en tab 2
- [ ] Cambios en tab 1 **no deben afectar** tab 2
- [ ] Ambos tabs deben funcionar independientemente

### Network Offline
- [ ] Navegar a `/admin`
- [ ] Activar "Offline" en Dev Tools
- [ ] Spinner debe detenerse después de ~5 segundos
- [ ] Mostrar error o redirigir (depende tu UX)

### Wrong Role in Database
- [ ] Usuario tiene `usuarios_sistema.rol = "invalid"`
- [ ] Intentar acceder a `/admin`
- [ ] **DEBE redirigir a /**

---

## 📋 Final Checklist

| Item | Status |
|------|--------|
| Admin user puede acceder | ✅ |
| Staff user tiene read-only | ✅ |
| Regular user es rechazado | ✅ |
| Not logged user redirige a /login | ✅ |
| Colores paleta FarmaCUI | ✅ |
| Tabla productos funciona | ✅ |
| Tabla pedidos funciona | ✅ |
| Formulario agregar funciona | ✅ |
| Botón eliminar funciona | ✅ |
| Selector estado pedidos funciona | ✅ |
| No errores en console | ✅ |
| No errores de compilación | ✅ |

---

## 🐛 Troubleshooting

### "Se queda en spinner infinitamente"
→ Verificar que supabase.auth.getUser() funciona en console

### "Redirige a / cuando debe mostrar tabla"
→ Verificar que usuario existe en `usuarios_sistema` con rol correcto

### "Colores no se ven"
→ Verificar que tailwind.config.mjs tiene definidas todas las variables `farma-*`

### "Botones no funcionan"
→ Verificar en console si hay errores de JavaScript

---

## 📞 Report Issues

Si algo no funciona:
1. Abrir Dev Tools (F12)
2. Revisar Console para errores
3. Revisar Network tab para llamadas fallidas
4. Copiar el error y contexto
5. Reportar con screenshot
