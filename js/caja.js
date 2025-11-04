import { verificarToken, cargarProductos } from './renderer.js';

let ordenModal = 'CodigoProducto';
const TIPO_CAMBIO = 20.00;
let ticketActual = [];
let ticketItemCounter = 0;

const modal = document.getElementById('product-list-modal-backdrop');
const openBtn = document.getElementById('btn-lista-productos');
const closeBtn = document.getElementById('modal-close-btn');
const tablaCuerpoModal = document.getElementById('modal-tabla-cuerpo');
const barraBusquedaInputModal = document.getElementById('modalBarraBusqueda');

const paymentModal = document.getElementById('payment-modal-backdrop');
const openPaymentBtn = document.getElementById('btn-pagar');
const closePaymentBtn = document.getElementById('payment-modal-close-btn');

const cancelConfirmModal = document.getElementById('cancel-confirm-modal-backdrop');
const btnCancelOne = document.getElementById('btn-cancel-one');
const btnCancelAll = document.getElementById('btn-cancel-all');
const btnCancelAbort = document.getElementById('btn-cancel-abort');
let currentItemCodigoToCancel = null;

const facturarModal = document.getElementById('facturar-modal-backdrop');
const facturarCheck = document.getElementById('facturar-check');
const btnFacturaCancelar = document.getElementById('btn-factura-cancelar');

document.addEventListener('DOMContentLoaded', () => {
    verificarToken();

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
    // ... (después del listener de btnCancelar)
    
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
    if (facturarCheck) {
        facturarCheck.addEventListener('change', () => {
            if (facturarCheck.checked) {
                // Si el usuario marca "Facturar":
                // 1. Ocultamos la modal de pago
                paymentModal.style.display = 'none';
                // 2. Mostramos la modal de facturación
                facturarModal.style.display = 'flex';
                
                // Aquí iría la lógica para "Cargar" los datos
                // del ticket actual en la modal de factura.
            }
        });
    }

    if (btnFacturaCancelar) {
        btnFacturaCancelar.addEventListener('click', () => {
            // Si el usuario cancela la factura:
            // 1. Ocultamos la modal de facturación
            facturarModal.style.display = 'none';
            // 2. Volvemos a mostrar la modal de pago
            paymentModal.style.display = 'flex';
        });
    }
});

async function obtenerProductos(orden) {
    return cargarProductos(orden).then(response => {
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
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Si el nombre o la descripción son nulos, guarda un texto vacío ''
        fila.dataset.codigoProducto = producto.CodigoProducto;
        fila.dataset.descripcion = producto.Descripcion || ''; // <-- LÍNEA CORREGIDA
        fila.dataset.nombre = producto.Nombre || '';       // <-- LÍNEA CORREGIDA
        fila.dataset.precio = producto.Precio;
        fila.dataset.stock = producto.Stock;
        // --- FIN DE LA CORRECCIÓN ---

        fila.appendChild(crearCelda(producto.CodigoProducto));
        fila.appendChild(crearCelda(producto.Nombre));
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

    document.querySelector('.summary-row.total span:last-child').textContent = `$${totalMxn.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `Usd $${totalUsd.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = cantidadUltimoItem;
    document.querySelector('.summary-row:nth-child(4) span:last-child').textContent = totalLineas;

    document.getElementById('payment-total-mxn').value = `$${totalMxn.toFixed(2)}`;
    document.getElementById('payment-total-usd').value = `$${totalUsd.toFixed(2)}`;
}

async function buscarYAgregarProductoPorCodigo(codigo) {
    try {
        const todosLosProductos = await cargarProductos('CodigoProducto');
        
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

/**
 * Maneja la selección visual de un item en el ticket.
 * @param {Event} event - El evento de clic.
 */
function manejarSeleccionTicket(event) {
    document.querySelectorAll('.ticket-item').forEach(item => {
        item.classList.remove('ticket-item-selected');
    });
    event.currentTarget.classList.add('ticket-item-selected');
}

/**
 * Busca y elimina el producto que esté seleccionado en el ticket.
 */
function cancelarProductoSeleccionado() {
    const itemSeleccionado = document.querySelector('.ticket-item-selected');
    
    if (!itemSeleccionado) {
        alert("Por favor, seleccione un producto para cancelar.");
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
    
    alert(`Se eliminó 1 unidad de "${productoEnTicket.descripcion}". Quedan ${productoEnTicket.cantidad}.`);
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
    
    alert(`Se eliminaron ${cantidadEliminada} unidades de "${descripcion}".`);
}