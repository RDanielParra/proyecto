// js/permisos.js

function aplicarPermisos() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("No se encontró el token de autenticación. Redirigiendo a login.");
        // Opcional: Redirigir al login si no hay token
        // window.location.href = 'sesion.html'; 
        return;
    }

    // 1. Decodificar el token (Solo se necesita la parte del payload)
    // El payload es la segunda parte del token (entre el primer y segundo punto)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // El token contiene: id, usuario, puesto (según tu main.js)
    const puesto = decodedPayload.puesto.toLowerCase(); 
    console.log(puesto)
    // 2. Definir los botones
    const btnCatalogo = document.getElementById('catalogoBtn');
    const btnCaja = document.getElementById('cajaBtn');
    const btnRegistrar = document.getElementById('registerBtn');

    // 3. Lógica de Control de Acceso (RBAC)
    switch (puesto) {
        case 'admin':
            // Admin: todos los botones
            if (btnCatalogo) btnCatalogo.style.display = 'block';
            if (btnCaja) btnCaja.style.display = 'block';
            if (btnRegistrar) btnRegistrar.style.display = 'block';
            break;

        case 'almacenista':
            // Almacenista: Catalogo de Productos
            if (btnCatalogo) btnCatalogo.style.display = 'block';
            break;

        case 'cajero':
            // Cajero: Caja
            if (btnCaja) btnCaja.style.display = 'block';
            break;

        default:
            console.warn(`Puesto desconocido: ${puesto}. No se mostrarán botones.`);
    }
}

// Ejecutar la función al cargar la página
aplicarPermisos();