import os
from ebooklib import epub

def create_epub_depth():
    book = epub.EpubBook()

    # --- METADATA ---
    book.set_identifier('farmacui-v2.0.1-deep-dive')
    book.set_title('Anatomía FarmaCUI 2.0.1: Profundización Técnica')
    book.set_language('es')
    book.add_author('FarmaCUI Dev Team & Gemini')

    # --- ESTILOS CSS (Mejorados para lectura técnica) ---
    style = '''
    body { font-family: "Georgia", serif; line-height: 1.6; color: #1f2937; }
    h1 { font-family: "Helvetica Neue", sans-serif; color: #111827; border-bottom: 3px solid #3b82f6; padding-bottom: 0.3em; margin-top: 2em; }
    h2 { font-family: "Helvetica Neue", sans-serif; color: #2563eb; margin-top: 1.5em; border-left: 5px solid #2563eb; padding-left: 10px; }
    h3 { font-family: "Helvetica Neue", sans-serif; color: #4b5563; font-weight: bold; margin-top: 1.2em; }
    pre { background-color: #1e293b; color: #f8fafc; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: "Consolas", "Monaco", monospace; font-size: 0.85em; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    code { font-family: "Consolas", "Monaco", monospace; color: #ec4899; background-color: #fce7f3; padding: 2px 4px; border-radius: 4px; }
    pre code { background-color: transparent; color: #e2e8f0; padding: 0; }
    .concept-box { background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .concept-title { font-weight: bold; color: #0369a1; display: block; margin-bottom: 5px; text-transform: uppercase; font-size: 0.8em; letter-spacing: 1px; }
    .warning { background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; color: #991b1b; }
    '''
    css_file = epub.EpubItem(uid="style_nav", file_name="style/nav.css", media_type="text/css", content=style)
    book.add_item(css_file)

    # --- CAPÍTULO 1: ARQUITECTURA DE ISLAS E HIDRATACIÓN ---
    c_astro = epub.EpubHtml(title='El Problema de la Hidratación', file_name='deep_astro.xhtml', lang='es')
    c_astro.content = '''
    <h1>1. Arquitectura de Islas e Hidratación</h1>
    <p>Durante el desarrollo, nos encontramos con un problema crítico en la página de Perfil: <em>"Redirección al login aunque ya estoy logueado"</em>. Para entender la solución, debemos entender cómo funciona Astro.</p>

    <h2>El Ciclo de Vida: Servidor vs. Cliente</h2>
    <div class="concept-box">
        <span class="concept-title">Concepto Clave: SSR (Server Side Rendering)</span>
        Astro, por defecto, ejecuta todo el JavaScript en el servidor (Node.js) y envía al navegador <strong>solamente HTML estático</strong>. Una vez que el HTML llega al navegador, el JS ha desaparecido.
    </div>

    <h3>El Conflicto del LocalStorage</h3>
    <p>Supabase guarda la sesión del usuario (token JWT) en el <code>localStorage</code> del navegador.
    <br>Cuando usábamos código de servidor (entre los guiones <code>---</code>) para verificar la sesión:</p>
    <pre>
---
// Esto corre en el Servidor (Node.js)
// Node.js NO tiene acceso a 'window' ni 'localStorage'
const { user } = await supabase.auth.getUser(); 
// Resultado: user es NULL (porque el servidor no ve las cookies/storage del navegador)
---
    </pre>
    <p>Por eso el servidor siempre creía que éramos invitados y nos redirigía.</p>

    <h3>La Solución: <code>client:only="react"</code></h3>
    <p>Al mover la lógica a un componente React (<code>UserProfile.jsx</code>) y usar la directiva <code>client:only</code>, le dijimos a Astro:</p>
    <blockquote>"No intentes renderizar esto en el servidor. Envía un espacio en blanco y deja que el navegador (que sí tiene acceso al LocalStorage) cargue el componente".</blockquote>
    '''

    # --- CAPÍTULO 2: TRANSACCIONES ACID Y CONCURRENCIA ---
    c_sql = epub.EpubHtml(title='Ingeniería SQL: Transacciones y ACID', file_name='deep_sql.xhtml', lang='es')
    c_sql.content = '''
    <h1>2. Ingeniería SQL: Transacciones ACID</h1>
    <p>La función <code>crear_orden_compra</code> no es una simple inserción de datos. Es un mecanismo de defensa contra la inconsistencia de datos.</p>

    <h2>El Problema de la "Condición de Carrera" (Race Condition)</h2>
    <p>Imagina que queda <strong>1 unidad</strong> de Ibuprofeno. Dos usuarios, Ana y Beto, hacen clic en "Comprar" exactamente al mismo milisegundo.</p>
    <ul>
        <li>El proceso de Ana lee el stock: Ve 1.</li>
        <li>El proceso de Beto lee el stock: Ve 1 (porque Ana aún no terminó de comprar).</li>
        <li>Ana compra. Stock baja a 0.</li>
        <li>Beto compra. Stock baja a -1.</li>
    </ul>
    <div class="warning"><strong>Resultado:</strong> Has vendido un producto que no tienes. Esto es inaceptable en E-commerce.</div>

    <h2>La Solución: <code>FOR UPDATE</code></h2>
    <p>En nuestra función PL/pgSQL utilizamos una cláusula especial:</p>
    <pre>
SELECT stock INTO v_stock_actual 
FROM productos 
WHERE id = v_producto_id
FOR UPDATE; -- <--- LA MAGIA ESTÁ AQUÍ
    </pre>
    <p><code>FOR UPDATE</code> le dice a la base de datos: <em>"Voy a leer esta fila, pero bloquéala. Nadie más puede leerla ni escribir en ella hasta que yo termine mi transacción completa"</em>.</p>
    <p>Si Beto intenta comprar mientras Ana está procesando, la base de datos pondrá a Beto en espera (pausa) hasta que Ana termine. Cuando le toque a Beto, leerá Stock = 0 y su compra fallará correctamente.</p>

    <h2>Atomicidad (La 'A' de ACID)</h2>
    <p>Usamos un bloque <code>BEGIN ... EXCEPTION ... END</code>. Si falla <em>cualquier</em> cosa (stock insuficiente, error de red, ID inválido), se ejecuta un <strong>ROLLBACK</strong> automático.</p>
    <p>Esto asegura que nunca tendremos una venta registrada sin sus detalles, o un stock descontado sin una venta asociada.</p>
    '''

    # --- CAPÍTULO 3: SEGURIDAD RLS (ROW LEVEL SECURITY) ---
    c_rls = epub.EpubHtml(title='Seguridad Profunda (RLS)', file_name='deep_rls.xhtml', lang='es')
    c_rls.content = '''
    <h1>3. Seguridad Profunda: Row Level Security (RLS)</h1>
    <p>En un backend tradicional (Node/PHP), el servidor tiene permisos de "Superusuario" y filtramos los datos con <code>if</code> en el código. En Supabase, la seguridad vive <strong>en la base de datos</strong>.</p>

    <h2>El Principio de "Defensa en Profundidad"</h2>
    <p>Aunque un hacker lograra engañar a tu Frontend para enviar una petición de "Borrar todos los productos", la base de datos lo detendría.</p>

    <h3>Anatomía de una Política</h3>
    <pre>
CREATE POLICY "Clientes solo ven sus ordenes" 
ON ventas
FOR SELECT 
USING ( auth.uid() = cliente_id );
    </pre>
    <ul>
        <li><strong><code>auth.uid()</code>:</strong> Es una función especial de Supabase que extrae el ID del usuario del Token JWT enviado en la cabecera. Es in-falsificable por el usuario.</li>
        <li><strong>Lógica:</strong> PostgreSQL revisa fila por fila. Si el ID de la fila no coincide con el ID del token, la fila <em>es invisible</em>, como si no existiera.</li>
    </ul>

    <h2>Security Definer vs. Invoker</h2>
    <p>Nuestra función <code>crear_orden_compra</code> usa <code>SECURITY DEFINER</code>. ¿Por qué?</p>
    <ul>
        <li>Los clientes normales <strong>NO</strong> tienen permiso para hacer <code>UPDATE</code> en la tabla <code>productos</code> (para evitar que cambien precios o stock manualmente).</li>
        <li>Pero al comprar, necesitan restar stock.</li>
        <li><code>SECURITY DEFINER</code> hace que la función se ejecute con los permisos del <strong>Creador de la función (Admin)</strong>, no del usuario que la llama. Es como un "Permiso temporal elevado" solo durante esa operación.</li>
    </ul>
    '''

    # --- CAPÍTULO 4: ESTADO CON NANOSTORES ---
    c_nano = epub.EpubHtml(title='Patrones de Estado: NanoStores', file_name='deep_nano.xhtml', lang='es')
    c_nano.content = '''
    <h1>4. Patrones de Estado: ¿Por qué NanoStores?</h1>
    <p>Podríamos haber usado React Context o Redux, pero elegimos NanoStores. La razón es la arquitectura de Astro.</p>

    <h2>El Problema del Contexto en Astro</h2>
    <p>En Astro, los componentes de React son "Islas". A menudo, están aisladas unas de otras en el árbol del DOM. Un <code>Context.Provider</code> en el Header no puede pasar datos fácilmente a un <code>ProductCard</code> en el Main, porque Astro los renderiza como bloques separados de HTML.</p>

    <h2>El Patrón Pub/Sub (Publicar/Suscribir)</h2>
    <p>NanoStores vive <strong>fuera</strong> del árbol de componentes de React. Es un objeto global puro de JavaScript.</p>
    <ol>
        <li>El store <code>cart</code> existe en memoria.</li>
        <li>El componente <code>Header</code> se <strong>suscribe</strong> (<code>cart.subscribe</code>).</li>
        <li>El componente <code>ProductCard</code> <strong>publica</strong> un cambio (<code>cart.setKey</code>).</li>
        <li>NanoStores avisa a todos los suscriptores.</li>
    </ol>
    <p>Esto desacopla completamente la lógica de negocio de la interfaz gráfica, permitiendo que el carrito funcione incluso si cambiamos React por Vue o Svelte en el futuro.</p>
    '''

    # --- ENSAMBLADO ---
    book.add_item(c_astro)
    book.add_item(c_sql)
    book.add_item(c_rls)
    book.add_item(c_nano)

    book.spine = ['nav', c_astro, c_sql, c_rls, c_nano]

    book.toc = (
        epub.Link('deep_astro.xhtml', '1. Arquitectura de Islas e Hidratación', 'astro'),
        epub.Link('deep_sql.xhtml', '2. Ingeniería SQL y Transacciones', 'sql'),
        epub.Link('deep_rls.xhtml', '3. Seguridad RLS a fondo', 'rls'),
        epub.Link('deep_nano.xhtml', '4. Patrones de Estado', 'nano'),
    )

    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    epub.write_epub('Anatomia_farmaCUI_Detallada_2.0.1.epub', book, {})
    print("✅ ¡Versión Extendida 2.0.1 generada con éxito!")

if __name__ == '__main__':
    create_epub_depth()