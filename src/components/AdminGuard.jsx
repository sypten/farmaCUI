import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminGuard({ children, allowedRoles = ['admin', 'superadmin', 'staff'] }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('🔍 AdminGuard: Verificando sesión...');
        
        // 1. Verificar Sesión en LocalStorage
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.warn('❌ AdminGuard: No hay sesión activa');
          setLoading(false);
          window.location.href = '/login';
          return;
        }

        console.log('✅ AdminGuard: Sesión encontrada. Verificando rol...');

        // 2. Consultar Rol en Base de Datos
        const { data: userRole, error } = await supabase
          .from('usuarios_sistema')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('❌ AdminGuard: Error en BD:', error.message);
          setLoading(false);
          window.location.href = '/';
          return;
        }

        // 3. Validar Rol
        if (!userRole || !allowedRoles.includes(userRole.rol)) {
          console.warn(`⛔ AdminGuard: Acceso denegado. Rol: ${userRole?.rol}`);
          setLoading(false);
          window.location.href = '/';
          return;
        }

        console.log(`✅ AdminGuard: Autorizado. Rol: ${userRole.rol}`);
        setAuthorized(true);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ AdminGuard: Error inesperado:', err);
        setLoading(false);
        window.location.href = '/';
      }
    }

    checkAuth();
  }, [allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-farma-primary"></div>
        <p className="mt-4 text-farma-secondary font-bold animate-pulse">Verificando acceso...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}