function aplicarPermisos() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("No se encontró el token de autenticación. Redirigiendo a login.");

        return;
    }

    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    const puesto = decodedPayload.puesto.toLowerCase(); 
    const btnCatalogo = document.getElementById('catalogoBtn');
    const btnCaja = document.getElementById('cajaBtn');
    const btnRegistrar = document.getElementById('registerBtn');
    const btnCerrarSesion = document.getElementById('cerrarSesionBtn')
    const btnTickets = document.getElementById('ticketMenuBtn');

    switch (puesto) {
        case 'gerente':
            if (btnCatalogo) btnCatalogo.style.display = 'block';
            if (btnCaja) btnCaja.style.display = 'block';
            if (btnRegistrar) btnRegistrar.style.display = 'block';
            if (btnTickets) btnTickets.style.display = 'block';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'block';
            break;
        case 'admin':
            if (btnCatalogo) btnCatalogo.style.display = 'block';
            if (btnCaja) btnCaja.style.display = 'block';
            if (btnRegistrar) btnRegistrar.style.display = 'block';
            if (btnTickets) btnTickets.style.display = 'block';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'block';
            break;

        case 'almacenista':
            if (btnCatalogo) btnCatalogo.style.display = 'block';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'block';
            break;

        case 'cajero':
            if (btnCaja) btnCaja.style.display = 'block';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'block';
            break;

        default:
            console.warn(`Puesto desconocido: ${puesto}. No se mostrarán botones.`);
    }
}

aplicarPermisos();