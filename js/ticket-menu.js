import { cargarTickets, verificarToken } from './renderer.js'
let orden = 'NumeroTicket'
const tablaCuerpo = document.getElementById('tabla-cuerpo-tickets')
console.log('Tabla cuerpo tickets:', tablaCuerpo)
const barraBusquedaInput = document.getElementById('barraBusqueda')

document.addEventListener('DOMContentLoaded', verificarToken)

btnEliminar.addEventListener('click', async () => { 
    console.log('Botón Eliminar presionado');

    const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

    if (filaSeleccionada) {
        const NumeroTicket = filaSeleccionada.dataset.NumeroTicket;
        
        const confirmado = confirm(`¿Estás seguro de que quieres cancelar la venta ${NumeroTicket}?`);

        if (confirmado) {
            try {
                const resultado = await window.api.eliminarTicket(NumeroTicket);
                
                if (resultado === true) {
                    console.log(`ticket ${NumeroTicket} eliminado.`);
                    window.api.sendNotification(`ticket ${NumeroTicket} cancelado con éxito`);
                    renderizarProductos(orden);
                } else if (resultado.error) {
                    console.error('Error de BD:', resultado.error);
                    window.api.sendNotification(`Error: No se pudo cancelar. ${resultado.error}`);
                } else {
                    window.api.sendNotification('Error: La venta no fue encontrado.');
                }
            } catch (error) {
                console.error('Error fatal al llamar a eliminarProducto:', error);
                window.api.sendNotification('Error: No se pudo cancelar la venta');
            }
        } else {
            console.log('Eliminación cancelada por el usuario.');
        }
    } else {
        console.warn('No se ha seleccionado ningúna venta para cancelar.');
        window.api.sendNotification('Error: Debes seleccionar una venta para cancelarla.');
    }
})

btnReporte.addEventListener('click', () => {
    console.log('Botón reporte presionado');
    window.api.abrirVentanaReporte(); 
})

document.addEventListener('DOMContentLoaded', () => {

    const dropdown = document.getElementById('dropdownFiltro')
    const header = document.getElementById('filtroSeleccionado')
    const menu = document.getElementById('menuFiltro')
    const campoActual = document.getElementById('campoActual')

    header.addEventListener('click', () => {
        const isHidden = menu.style.display === 'block'
        menu.style.display = isHidden ? 'none' : 'block'
    })

    menu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            
            campoActual.textContent = item.textContent
            
            menu.style.display = 'none'
            
            console.log(`Filtro seleccionado: ${item.dataset.campo}`)
            orden = item.dataset.campo
            renderizarProductos(orden)
        })
    })

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.style.display = 'none'
        }
    })

    if (barraBusquedaInput) {
        barraBusquedaInput.addEventListener('input', filtrarTabla)
    }

    window.api.onRefrescarProductos(() => {
        console.log('Evento de refrescar recibido. Recargando empleados...');
        renderizarProductos(orden);
    });

    renderizarProductos(orden)
    
})

async function obtenerProductos(orden) {
        return cargarTickets(orden).then(response => {
            return response
        })
    }
    function crearCelda(content) {
        const celda = document.createElement('div');
        celda.textContent = content;
        return celda;
    }
    
    function renderizarTabla(productos) {
        // Limpiar filas anteriores
        tablaCuerpo.innerHTML = ''; 

        productos.forEach(producto => {
            const fila = document.createElement('div');
            fila.classList.add('tabla-fila');
            
            fila.dataset.NumeroTicket = producto.NumeroTicket
            fila.dataset.IdEmpleado = producto.IdEmpleado

            fila.appendChild(crearCelda(producto.NumeroTicket))
            fila.appendChild(crearCelda(`$${producto.Subtotal}`))
            fila.appendChild(crearCelda(producto.IdEmpleado))
            fila.appendChild(crearCelda(new Date(producto.FechaHora).toLocaleString('es-MX', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })))

            fila.addEventListener('click', seleccionarFila)

            tablaCuerpo.appendChild(fila);
        });
    }

    function seleccionarFila(event) {
        const filaSeleccionada = event.currentTarget;
        
        document.querySelectorAll('.tabla-fila').forEach(fila => {
            fila.classList.remove('fila-seleccionada');
        });

        filaSeleccionada.classList.add('fila-seleccionada');

        const codigoSeleccionado = filaSeleccionada.dataset.NumeroTicket;
        console.log(`Ticket seleccionado: ${codigoSeleccionado}`);

    }
    async function renderizarProductos (orden) {
        verificarToken()
        try {
            const productos = await obtenerProductos(orden);
            renderizarTabla(productos);
        } catch (error) {
            console.error('Error al cargar la lista de tickets:', error);
            window.api.sendNotification('Fallo al conectar en la base de datos')
        }
    }

    function filtrarTabla() {
    const searchTerm = barraBusquedaInput.value.toLowerCase().trim();

    const filas = Array.from(tablaCuerpo.querySelectorAll('.tabla-fila'));

    filas.forEach(fila => {
        let valorFila = '';

        if (orden === 'NumeroTicket') {
            valorFila = fila.dataset.NumeroTicket?.toLowerCase() || '';
        } else if (orden === 'IdEmpleado') {
            valorFila = fila.dataset.IdEmpleado?.toLowerCase() || '';
        }

        fila.style.display = valorFila.includes(searchTerm) || searchTerm === '' 
            ? 'grid' 
            : 'none';
    });
}