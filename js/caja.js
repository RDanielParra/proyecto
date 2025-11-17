 /* ========================================

   IMPORTACIONES Y VARIABLES GLOBALES

======================================== */

import { verificarToken, cargarProductos } from './renderer.js';


let ordenModal = 'CodigoProducto';

const TIPO_CAMBIO = 20.00;

let ticketActual = [];

let ticketItemCounter = 0;

let originalFooterHTML = '';

let currentItemCodigoToCancel = null;

let esCorteFinal = false;


/* ========================================

   SELECTORES DE ELEMENTOS

======================================== */

const headerInfoElement = document.querySelector('.header-info p:nth-child(2)');

const ticketFooter = document.getElementById('ticket-footer');


const modal = document.getElementById('product-list-modal-backdrop');

const openBtn = document.getElementById('btn-lista-productos');

const closeBtn = document.getElementById('modal-close-btn');

const tablaCuerpoModal = document.getElementById('modal-tabla-cuerpo');

const barraBusquedaInputModal = document.getElementById('modalBarraBusqueda');


const paymentModal = document.getElementById('payment-modal-backdrop');

const openPaymentBtn = document.getElementById('btn-pagar');

const closePaymentBtn = document.getElementById('payment-modal-close-btn');

const btnPagoEfectivo = document.getElementById('btn-pago-efectivo');

const btnPagoTarjeta = document.getElementById('btn-pago-tarjeta');

const btnPagoDolar = document.getElementById('btn-pago-dolar');

const btnPagoCheque = document.getElementById('btn-pago-cheque');

const pagoMxnInput = document.getElementById('payment-pago-mxn');

const pagoUsdInput = document.getElementById('payment-pago-usd');

const cambioMxnInput = document.getElementById('payment-cambio-mxn');

const totalMxnInput = document.getElementById('payment-total-mxn');


const cancelConfirmModal = document.getElementById('cancel-confirm-modal-backdrop');

const btnCancelOne = document.getElementById('btn-cancel-one');

const btnCancelAll = document.getElementById('btn-cancel-all');

const btnCancelAbort = document.getElementById('btn-cancel-abort');


const facturarModal = document.getElementById('facturar-modal-backdrop');

const facturarCheck = document.getElementById('facturar-check');

const btnFacturaCancelar = document.getElementById('btn-factura-cancelar');


const reporteModal = document.getElementById('reporte-modal-backdrop');

const reporteTitulo = document.getElementById('reporte-titulo');

const reporteContenido = document.getElementById('reporte-contenido');

const reporteModalCloseBtn = document.getElementById('reporte-modal-close-btn');


const btnCorteParcial = document.getElementById('btn-corte-parcial');

const btnCorteFinal = document.getElementById('btn-corte-final');

const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

const btnCancelarCuenta = document.getElementById('btn-cancelar-cuenta');


/* ========================================

   INICIALIZADOR PRINCIPAL

======================================== */

document.addEventListener('DOMContentLoaded', () => {

    verificarToken();

    originalFooterHTML = document.getElementById('ticket-footer').innerHTML;

   

    actualizarFechaHora();

    setInterval(actualizarFechaHora, 1000);


    if (openBtn) {

        openBtn.addEventListener('click', () => {

            modal.style.display = 'flex';

            renderizarProductosModal(ordenModal);

        });

    }


    if (closeBtn) {

        closeBtn.addEventListener('click', () => {

            modal.style.display = 'none';

        });

    }


    if (modal) {

        modal.addEventListener('click', (e) => {

            if (e.target === modal) {

                modal.style.display = 'none';

            }

        });

    }


    const dropdown = document.getElementById('modalDropdownFiltro');

    const header = document.getElementById('modalFiltroSeleccionado');

    const menu = document.getElementById('modalMenuFiltro');

    const campoActual = document.getElementById('modalCampoActual');


    if (header) {

        header.addEventListener('click', () => {

            const isHidden = menu.style.display === 'block';

            menu.style.display = isHidden ? 'none' : 'block';

        });

    }


    if (menu) {

        menu.querySelectorAll('a').forEach(item => {

            item.addEventListener('click', (e) => {

                e.preventDefault();

                campoActual.textContent = item.textContent;

                menu.style.display = 'none';

                ordenModal = item.dataset.campo;

                renderizarProductosModal(ordenModal);

            });

        });

    }


    document.addEventListener('click', (e) => {

        if (dropdown && !dropdown.contains(e.target)) {

            menu.style.display = 'none';

        }

    });


    if (barraBusquedaInputModal) {

        barraBusquedaInputModal.addEventListener('input', filtrarTablaModal);

    }

   

    if (openPaymentBtn) {

        openPaymentBtn.addEventListener('click', () => {

            paymentModal.style.display = 'flex';

            pagoMxnInput.value = '0.00';

            pagoUsdInput.value = '$0.00';

            cambioMxnInput.value = '$0.00';

        });

    }

    if (closePaymentBtn) {

        closePaymentBtn.addEventListener('click', () => {

            paymentModal.style.display = 'none';

        });

    }

    if (paymentModal) {

        paymentModal.addEventListener('click', (e) => {

            if (e.target === paymentModal) {

                paymentModal.style.display = 'none';

            }

        });

    }


    if (pagoMxnInput) {

        pagoMxnInput.addEventListener('input', calcularCambio);

    }


    const inputCodigo = document.getElementById('insert-code-input');

    if (inputCodigo) {

        inputCodigo.addEventListener('keypress', (e) => {

            if (e.key === 'Enter' || e.keyCode === 13) {

                e.preventDefault();

                const codigo = inputCodigo.value.trim();

                if (codigo) {

                    buscarYAgregarProductoPorCodigo(codigo);

                    inputCodigo.value = '';

                }

            }

        });

    }

    const btnCancelar = document.getElementById('btn-cancelar-producto');

    if (btnCancelar) {

        btnCancelar.addEventListener('click', () => {

            cancelarProductoSeleccionado();

        });

    }

   

    if (btnCancelAbort) {

        btnCancelAbort.addEventListener('click', () => {

            cancelConfirmModal.style.display = 'none';

            currentItemCodigoToCancel = null;

        });

    }

    if (btnCancelOne) {

        btnCancelOne.addEventListener('click', () => {

            reducirCantidadItem(currentItemCodigoToCancel);

            cancelConfirmModal.style.display = 'none';

            currentItemCodigoToCancel = null;

        });

    }

    if (btnCancelAll) {

        btnCancelAll.addEventListener('click', () => {

            eliminarItemCompleto(currentItemCodigoToCancel);

            cancelConfirmModal.style.display = 'none';

            currentItemCodigoToCancel = null;

        });

    }

   

    if (btnPagoEfectivo) {

        btnPagoEfectivo.addEventListener('click', () => handleRealizarPago('Efectivo'));

    }

    if (btnPagoTarjeta) {

        btnPagoTarjeta.addEventListener('click', () => handleRealizarPago('Tarjeta'));

    }

    if (btnPagoDolar) {

        btnPagoDolar.addEventListener('click', () => handleRealizarPago('Dolar'));

    }

    if (btnPagoCheque) {

        btnPagoCheque.addEventListener('click', () => handleRealizarPago('Cheque'));

    }


    if (btnFacturaCancelar) {

        btnFacturaCancelar.addEventListener('click', () => {

            facturarModal.style.display = 'none';

            limpiarVentaCompleta();

        });

    }


    if (btnCorteParcial) {

        btnCorteParcial.addEventListener('click', handleCorteParcial);

    }

    if (btnCorteFinal) {

        btnCorteFinal.addEventListener('click', handleCorteFinal);

    }

    if (reporteModalCloseBtn) {

        reporteModalCloseBtn.addEventListener('click', () => {

            reporteModal.style.display = 'none';

            if (esCorteFinal) {

                esCorteFinal = false;

                window.location.href = '../html/sesion.html';

            }

        });

    }


    if (btnCerrarSesion) {

        btnCerrarSesion.addEventListener('click', () => {

            window.location.href = '../html/sesion.html';

        });

    }


    if (btnCancelarCuenta) {

        btnCancelarCuenta.addEventListener('click', handleCancelarCuenta);

    }

});


/* ========================================

   FUNCIONES DE FECHA Y HORA

======================================== */

function actualizarFechaHora() {

    const ahora = new Date();

    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fechaFormateada = ahora.toLocaleDateString('es-ES', opcionesFecha);

    const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


    if (headerInfoElement) {

        headerInfoElement.textContent = `${fechaFormateada}, ${horaFormateada}`;

    }


    const cajeroSpan = document.querySelector('#ticket-footer.footer-info .footer-box:nth-child(1) span:nth-child(2)');

    const horaSpan = document.querySelector('#ticket-footer.footer-info .footer-box:nth-child(2) span:nth-child(2)');

    const fechaSpan = document.querySelector('#ticket-footer.footer-info .footer-box:nth-child(3) span:nth-child(2)');


    if (cajeroSpan && horaSpan && fechaSpan) {

        cajeroSpan.textContent = "Nombre Cajero";

        horaSpan.textContent = horaFormateada.substring(0, 5);

        fechaSpan.textContent = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });

    }

}


/* ========================================

   FUNCIONES DE MODAL DE PRODUCTOS

======================================== */

async function obtenerProductos(orden) {

    return window.api.cargarProductos(orden).then(response => {

        return response;

    });

}


function crearCelda(content) {

    const celda = document.createElement('div');

    celda.textContent = content;

    return celda;

}


function renderizarTablaModal(productos) {

    tablaCuerpoModal.innerHTML = '';

    productos.forEach(producto => {

        const fila = document.createElement('div');

        fila.classList.add('tabla-fila');

       

        fila.dataset.codigoProducto = producto.CodigoProducto;

        fila.dataset.descripcion = producto.Descripcion || '';

        fila.dataset.nombre = producto.Nombre || '';

        fila.dataset.precio = producto.Precio;

        fila.dataset.stock = producto.Stock;


        fila.appendChild(crearCelda(producto.CodigoProducto));

        fila.appendChild(crearCelda(producto.Descripcion));

        fila.appendChild(crearCelda(`$${producto.Precio}`));

        fila.appendChild(crearCelda(producto.Stock));


        fila.addEventListener('click', seleccionarFilaModal);

        tablaCuerpoModal.appendChild(fila);

    });

}


function seleccionarFilaModal(event) {

    const filaSeleccionada = event.currentTarget;

   

    document.querySelectorAll('#modal-tabla-cuerpo .tabla-fila').forEach(fila => {

        fila.classList.remove('fila-seleccionada');

    });

    filaSeleccionada.classList.add('fila-seleccionada');


    const productoData = {

        codigo: filaSeleccionada.dataset.codigoProducto,

        descripcion: filaSeleccionada.dataset.nombre || filaSeleccionada.dataset.descripcion || "Producto",

        precio: parseFloat(filaSeleccionada.dataset.precio),

        cantidad: 1

    };


    agregarProductoAlTicket(productoData);

   

    modal.style.display = 'none';

}


async function renderizarProductosModal(orden) {

    verificarToken();

    try {

        const productos = await obtenerProductos(orden);

        renderizarTablaModal(productos);

    } catch (error) {

        console.error('Error al cargar la lista de productos:', error);

        if (window.api && window.api.sendNotification) {

            window.api.sendNotification('Fallo al conectar en la base de datos');

        }

    }

}


function filtrarTablaModal() {

    const searchTerm = barraBusquedaInputModal.value.toLowerCase().trim();

    const campoFiltro = document.getElementById('modalCampoActual').textContent.toLowerCase();

   

    const filas = Array.from(tablaCuerpoModal.querySelectorAll('.tabla-fila'));

   

    filas.forEach(fila => {

        let valorFila = '';

        switch (campoFiltro) {

            case 'código':

                valorFila = fila.dataset.codigoProducto;

                break;

            case 'descripción':

                valorFila = fila.dataset.descripcion.toLowerCase();

                break;

            case 'nombre':

                valorFila = fila.dataset.nombre.toLowerCase();

                break;

            default:

                valorFila = '';

        }


        if (valorFila && (valorFila.includes(searchTerm) || searchTerm === '')) {

            fila.style.display = 'grid';

        } else {

            fila.style.display = 'none';

        }

    });

}


/* ========================================

   FUNCIONES DE LÓGICA DEL TICKET

======================================== */

function agregarProductoAlTicket(producto) {

    const itemsList = document.querySelector('.items-list');

    const productoExistente = ticketActual.find(p => p.codigo == producto.codigo);


    let cantidadAgregada = producto.cantidad || 1;


    if (productoExistente) {

        productoExistente.cantidad += cantidadAgregada;

       

        const itemDiv = itemsList.querySelector(`.ticket-item[data-codigo="${producto.codigo}"]`);

        if (itemDiv) {

            const importe = (productoExistente.cantidad * productoExistente.precio).toFixed(2);

            itemDiv.querySelector('.item-cant').textContent = productoExistente.cantidad;

            itemDiv.querySelector('.item-importe').textContent = `$${importe}`;

            manejarSeleccionTicket({ currentTarget: itemDiv });

        }

    } else {

        producto.cantidad = cantidadAgregada;

        ticketActual.push(producto);


        const importe = (producto.cantidad * producto.precio).toFixed(2);

        const descripcionMostrada = producto.descripcion || "Producto no encontrado";

       

        const itemDiv = document.createElement('div');

        itemDiv.classList.add('ticket-item');

        itemDiv.dataset.codigo = producto.codigo;

       

        itemDiv.innerHTML = `

            <span class="item-desc">${descripcionMostrada}</span>

            <span class="item-cant">${producto.cantidad}</span>

            <span class="item-importe">$${importe}</span>

        `;

       

        itemDiv.addEventListener('click', manejarSeleccionTicket);

        itemsList.appendChild(itemDiv);

        manejarSeleccionTicket({ currentTarget: itemDiv });

    }

   

    actualizarTotales(cantidadAgregada);

}


function actualizarTotales(cantidadUltimoItem = 0) {

    let totalMxn = 0;

    let totalCantidad = 0;

    let totalLineas = ticketActual.length;


    ticketActual.forEach(producto => {

        totalMxn += producto.precio * producto.cantidad;

        totalCantidad += producto.cantidad;

    });


    const totalUsd = totalMxn / TIPO_CAMBIO;


    if (cantidadUltimoItem === 0 && totalLineas > 0) {

        const ultimoItem = ticketActual[totalLineas - 1];

        cantidadUltimoItem = ultimoItem ? ultimoItem.cantidad : 0;

    }

    if (totalLineas === 0) {

        cantidadUltimoItem = 0;

    }


    const totalFormateado = `$${totalMxn.toFixed(2)}`;

    document.querySelector('.summary-row.total span:last-child').textContent = totalFormateado;

    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `Usd $${totalUsd.toFixed(2)}`;

    document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = cantidadUltimoItem;

    document.querySelector('.summary-row:nth-child(4) span:last-child').textContent = totalLineas;


    totalMxnInput.value = totalFormateado;

    document.getElementById('payment-total-usd').value = `$${totalUsd.toFixed(2)}`;

   

    calcularCambio();

}


async function buscarYAgregarProductoPorCodigo(codigo) {

    try {

        const todosLosProductos = await window.api.cargarProductos('CodigoProducto');

       

        const productoEncontrado = todosLosProductos.find(p => p.CodigoProducto == codigo);

       

        if (productoEncontrado) {

            const productoData = {

                codigo: productoEncontrado.CodigoProducto,

                descripcion: productoEncontrado.Nombre || productoEncontrado.Descripcion || "Producto",

                precio: parseFloat(productoEncontrado.Precio),

                cantidad: 1

            };

            agregarProductoAlTicket(productoData);

        } else {

            console.warn(`Producto con código ${codigo} no encontrado.`);

            if (window.api && window.api.sendNotification) {

                 window.api.sendNotification('Producto no encontrado');

             }

        }

    } catch (error) {

        console.error('Error al buscar producto por código:', error);

    }

}


function manejarSeleccionTicket(event) {

    document.querySelectorAll('.ticket-item').forEach(item => {

        item.classList.remove('ticket-item-selected');

    });

    event.currentTarget.classList.add('ticket-item-selected');

}


/* ========================================

   FUNCIONES DE CANCELACIÓN

======================================== */

function cancelarProductoSeleccionado() {

    const itemSeleccionado = document.querySelector('.ticket-item-selected');

   

    if (!itemSeleccionado) {

        window.api.sendNotification("Por favor, seleccione un producto para cancelar.");

        return;

    }


    currentItemCodigoToCancel = itemSeleccionado.dataset.codigo;

    const productoEnTicket = ticketActual.find(p => p.codigo == currentItemCodigoToCancel);


    if (!productoEnTicket) return;


    const descripcion = productoEnTicket.descripcion;

    const cantidadActual = productoEnTicket.cantidad;


    document.getElementById('cancel-confirm-title').textContent = `Eliminar "${descripcion}"`;

   

    if (cantidadActual > 1) {

        document.getElementById('cancel-confirm-text').textContent = `Hay ${cantidadActual} unidades de este producto. ¿Qué deseas hacer?`;

        btnCancelOne.style.display = 'block';

        btnCancelAll.textContent = `Eliminar Todos (${cantidadActual})`;

    } else {

        document.getElementById('cancel-confirm-text').textContent = `¿Estás seguro que quieres eliminar este producto?`;

        btnCancelOne.style.display = 'none';

        btnCancelAll.textContent = 'Eliminar';

    }


    cancelConfirmModal.style.display = 'flex';

}

function reducirCantidadItem(codigo) {

    if (!codigo) return;

   

    const productoEnTicket = ticketActual.find(p => p.codigo == codigo);

    if (!productoEnTicket) return;


    productoEnTicket.cantidad -= 1;


    const itemDiv = document.querySelector(`.ticket-item[data-codigo="${codigo}"]`);

    if (itemDiv) {

        const importe = (productoEnTicket.cantidad * productoEnTicket.precio).toFixed(2);

        itemDiv.querySelector('.item-cant').textContent = productoEnTicket.cantidad;

        itemDiv.querySelector('.item-importe').textContent = `$${importe}`;

    }

   

    actualizarTotales(1);

   

    window.api.sendNotification(`Se eliminó 1 unidad de "${productoEnTicket.descripcion}". Quedan ${productoEnTicket.cantidad}.`);

}


function eliminarItemCompleto(codigo) {

    if (!codigo) return;


    const productoEnTicket = ticketActual.find(p => p.codigo == codigo);

    if (!productoEnTicket) return;

   

    const cantidadEliminada = productoEnTicket.cantidad;

    const descripcion = productoEnTicket.descripcion;


    ticketActual = ticketActual.filter(p => p.codigo != codigo);

   

    const itemDiv = document.querySelector(`.ticket-item[data-codigo="${codigo}"]`);

    if (itemDiv) {

        itemDiv.remove();

    }

   

    actualizarTotales(0);

   

    window.api.sendNotification(`Se eliminaron ${cantidadEliminada} unidades de "${descripcion}".`);

}


function handleCancelarCuenta() {

    if (ticketActual.length > 0) {

        if (confirm("¿Estás seguro de que deseas cancelar toda la cuenta? Se borrarán todos los productos.")) {

            limpiarVentaCompleta();

        }
        window.api.mostrarDialogoContextual({
        titulo: 'Venta Cancelada',
        mensaje: 'La cuenta ha sido limpiada.'
        }).then(() => {
            inputCodigo.focus();
        });
    }

}


/* ========================================

   FUNCIONES DE PAGO E IMPRESIÓN

======================================== */

function calcularCambio() {

    const total = parseFloat(totalMxnInput.value.replace('$', '')) || 0;

    const pago = parseFloat(pagoMxnInput.value) || 0;


    const pagoEnUsd = pago / TIPO_CAMBIO;

    pagoUsdInput.value = `$${pagoEnUsd.toFixed(2)}`;


    let cambio = pago - total;

    if (cambio < 0) {

        cambio = 0;

    }


    cambioMxnInput.value = `$${cambio.toFixed(2)}`;

}


async function handleRealizarPago(metodoDePago) {

    if (ticketActual.length === 0) {

        window.api.sendNotification("No hay productos en el ticket.");

        return;

    }


    const totalVenta = parseFloat(totalMxnInput.value.replace('$', '')) || 0;

    const idEmpleadoLogueado = 1;

    let pago = 0;

    let cambio = 0;


    if (metodoDePago === 'Efectivo' || metodoDePago === 'Dolar') {

        pago = parseFloat(pagoMxnInput.value) || 0;

        if (pago < totalVenta) {

            window.api.sendNotification("El pago es insuficiente.");

            return;

        }

        cambio = pago - totalVenta;

   

    } else if (metodoDePago === 'Tarjeta' || metodoDePago === 'Cheque') {

        pago = totalVenta;

        cambio = 0;

    }


    const datosVenta = {

        idEmpleado: idEmpleadoLogueado,

        total: totalVenta,

        items: ticketActual,

        metodo: metodoDePago

    };


    try {

        const resultado = await window.api.registrarVenta(datosVenta);


        if (resultado.success) {

           

            const datosPago = {

                subtotal: totalVenta,

                pago: pago,

                cambio: cambio,

                metodo: metodoDePago,

                ticketNum: resultado.numeroTicket,

                cajero: "Nombre Cajero",

                cajaNum: 1

            };

                paymentModal.style.display = 'none';

                await mostrarTicketFinal(datosVenta, datosPago);

                setTimeout(limpiarVentaCompleta, 3000)  


        } else {

            window.api.sendNotification(`Error al registrar la venta: ${resultado.error}`);

        }


    } catch (error) {

        console.error('Error al invocar registrar-venta:', error);

        window.api.sendNotification('Error fatal de comunicación. Revise la consola.');

    }

}


async function mostrarTicketFinal(datosVenta, datosPago) {

    const itemsList = document.querySelector('.items-list');

    const ticketFooter = document.getElementById('ticket-footer');


    const lineaDiv = document.createElement('div');

    lineaDiv.style.borderBottom = "2px dashed #000";

    lineaDiv.style.marginTop = "10px";

    itemsList.appendChild(lineaDiv);


    const totalArticulos = datosVenta.items.reduce((total, p) => total + p.cantidad, 0);


    const summaryHTML = `

        <div class="ticket-summary-wrapper">

            <p>Articulos: ${totalArticulos}</p>

            <p>Subtotal: $${datosPago.subtotal.toFixed(2)}</p>

            <p>Su pago: $${datosPago.pago.toFixed(2)}</p>

            <p>${datosPago.metodo}: $${datosPago.pago.toFixed(2)}</p>

            <p>Cambio: $${datosPago.cambio.toFixed(2)}</p>

            <p>Ticket: ${String(datosPago.ticketNum).padStart(6, '0')}</p>

            <p>Vta IVA: $0.00</p>

           

            <div class="cajero-info">

                <span>Cajero: ${datosPago.cajero}</span>

                <span>Caja: ${datosPago.cajaNum}</span>

            </div>


            <div class="gracias-msg">

                <p>PARA FACTURA ENVIAR MENSAJE AL NUM. 867 777 777 77</p>

                <p>GRACIAS POR SU COMPRA</p>

            </div>

        </div>

    `;


    ticketFooter.innerHTML = summaryHTML;

    ticketFooter.className = 'ticket-summary-wrapper';


    try {

        await window.api.solicitarImpresion();

    } catch (err) {

        console.error("Error en el diálogo de impresión:", err);

    }

}


function limpiarVentaCompleta() {

    ticketActual = [];

    ticketItemCounter = 0;


    const itemsList = document.querySelector('.items-list');

    itemsList.innerHTML = '';


    actualizarTotales(0);


    paymentModal.style.display = 'none';

    cancelConfirmModal.style.display = 'none';

    facturarModal.style.display = 'none';

   

    if (facturarCheck) {

        facturarCheck.checked = false;

    }


    const ticketFooter = document.getElementById('ticket-footer');

    if (ticketFooter) {

        ticketFooter.innerHTML = originalFooterHTML;

        ticketFooter.className = 'footer-info';

        actualizarFechaHora();

    }

}


/* ========================================

   FUNCIONES DE CORTE (REPORTES)

======================================== */

function mostrarReporte(titulo, data) {

    const { resumen, detalle } = data;


    const totalFormateado = resumen.totalVentas ? parseFloat(resumen.totalVentas).toFixed(2) : '0.00';

   

    let contenido = `

================================

     ${titulo}

================================


Fecha: ${new Date().toLocaleDateString()}

Hora:  ${new Date().toLocaleTimeString()}


--------------------------------

RESUMEN DE VENTAS

--------------------------------


Total de Tickets Vendidos: ${resumen.numeroTickets}

Monto Total Vendido:    $${totalFormateado}


--------------------------------

DETALLE POR PAGO

--------------------------------

`;


    if (detalle.length > 0) {

        detalle.forEach(metodo => {

            const totalMetodoFormateado = parseFloat(metodo.totalMetodo).toFixed(2);

            let nombreMetodo = (metodo.MetodoPago + ":").padEnd(10);

            let ticketsMetodo = `(${metodo.numTicketsMetodo} tickets)`;

            contenido += `${nombreMetodo} $${totalMetodoFormateado.padStart(10)} ${ticketsMetodo}\n`;

        });

    } else {

        contenido += "(No se encontraron ventas detalladas)\n";

    }


    contenido += `================================

`;


    reporteTitulo.textContent = titulo;

    reporteContenido.textContent = contenido;

    reporteModal.style.display = 'flex';

}


async function handleCorteParcial() {

    esCorteFinal = false;

    const idEmpleadoLogueado = 1;


    try {

        const resultado = await window.api.generarCorteParcial(idEmpleadoLogueado);

        if (resultado.success) {

            mostrarReporte('CORTE PARCIAL (CAJERO)', resultado.data);

        } else {

            window.api.sendNotification(`Error al generar corte: ${resultado.error}`);

        }

    } catch (error) {

        console.error("Error al invocar corte parcial:", error);

        window.api.sendNotification("Error de comunicación al generar el corte.");

    }

}


async function handleCorteFinal() {

    esCorteFinal = true;

    try {

        const resultado = await window.api.generarCorteFinal();

        if (resultado.success) {

            mostrarReporte('CORTE FINAL (DÍA)', resultado.data);

        } else {

            window.api.sendNotification(`Error al generar corte: ${resultado.error}`);

        }

    } catch (error) {

        console.error("Error al invocar corte final:", error);

        window.api.sendNotification("Error de comunicación al generar el corte.");

    }

} 