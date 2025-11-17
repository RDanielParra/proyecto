import { cargarProductos, verificarToken } from './renderer.js'
let orden = 'CodigoProducto'
const tablaCuerpo = document.getElementById('tabla-cuerpo-productos')
const barraBusquedaInput = document.getElementById('barraBusqueda')

document.addEventListener('DOMContentLoaded', () => {
    verificarToken()

    const btnEliminar = document.getElementById('btnEliminar')
    const btnAgregar = document.getElementById('btnAgregar')
    const btnModificar = document.getElementById('btnModificar')

    if (btnEliminar) {
        btnEliminar.addEventListener('click', async () => { 
            try {
                const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

                if (filaSeleccionada) {
                    const idProducto = filaSeleccionada.dataset.codigoProducto;
                    
                    const confirmado = confirm(`¿Estás seguro de que quieres eliminar el producto ${idProducto}?`);

                    if (confirmado) {
                        try {
                            const resultado = await window.api.eliminarProducto(idProducto);
                            
                            if (resultado === true) {
                                window.api.sendNotification(`Producto ${idProducto} eliminado con éxito`);
                                renderizarProductos(orden);
                            } else if (resultado.error) {
                                window.api.sendNotification(`Error: No se pudo eliminar. ${resultado.error}`);
                            } else {
                                window.api.sendNotification('Error: El producto no fue encontrado.');
                            }
                        } catch (error) {
                            window.api.sendNotification('Error: No se pudo eliminar el producto');
                        }
                    }
                } else {
                    window.api.sendNotification('Error: Debes seleccionar un producto para eliminar');
                }
            } finally {
                if (barraBusquedaInput) {
                    barraBusquedaInput.focus();
                }
            }
        })
    }

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            window.api.abrirVentanaAgregar(); 
        })
    }

    if (btnModificar) {
        btnModificar.addEventListener('click', () => {
            const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

            if (filaSeleccionada) {
                const idProducto = filaSeleccionada.dataset.codigoProducto;
                window.api.abrirVentanaModificar(idProducto);
            } else {
                window.api.sendNotification('Error: Debes seleccionar un producto para modificar');
            }
        });
    }

    const dropdown = document.getElementById('dropdownFiltro')
    const header = document.getElementById('filtroSeleccionado')
    const menu = document.getElementById('menuFiltro')
    const campoActual = document.getElementById('campoActual')

    if (header) {
        header.addEventListener('click', () => {
            const isHidden = menu.style.display === 'block'
            menu.style.display = isHidden ? 'none' : 'block'
        })
    }

    if (menu) {
        menu.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                
                campoActual.textContent = item.textContent
                
                menu.style.display = 'none'
                
                orden = item.dataset.campo
                renderizarProductos(orden)
                if (barraBusquedaInput) {
                    barraBusquedaInput.focus()
                }
            })
        })
    }

    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && menu) {
            menu.style.display = 'none'
        }
    })

    if (barraBusquedaInput) {
        barraBusquedaInput.addEventListener('input', filtrarTabla)
    }

    window.api.onRefrescarProductos(() => {
        renderizarProductos(orden);
    });

    renderizarProductos(orden)
})

async function obtenerProductos(orden) {
    return cargarProductos(orden).then(response => {
        return response
    })
}

function crearCelda(content) {
    const celda = document.createElement('div');
    celda.textContent = content;
    return celda;
}

function renderizarTabla(productos) {
    tablaCuerpo.innerHTML = ''; 

    productos.forEach(producto => {
        const fila = document.createElement('div');
        fila.classList.add('tabla-fila');
        
        fila.dataset.codigoProducto = producto.CodigoProducto;
        fila.dataset.descripcion = producto.Descripcion

        fila.appendChild(crearCelda(producto.CodigoProducto))
        fila.appendChild(crearCelda(producto.Descripcion))
        fila.appendChild(crearCelda(`$${producto.Precio}`))
        fila.appendChild(crearCelda(producto.Stock))

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
}

async function renderizarProductos (orden) {
    verificarToken()
    try {
        const productos = await obtenerProductos(orden);
        renderizarTabla(productos);
    } catch (error) {
        window.api.sendNotification('Fallo al conectar en la base de datos')
    }
}

function filtrarTabla() {
    const searchTerm = barraBusquedaInput.value.toLowerCase().trim();
    const campoFiltro = document.getElementById('campoActual').textContent.toLowerCase();
    
    const filas = Array.from(tablaCuerpo.querySelectorAll('.tabla-fila'));
    
    filas.forEach(fila => {
        let valorFila = '';
        
        switch (campoFiltro) {
            case 'código':
                valorFila = fila.dataset.codigoProducto;
                break;
            case 'descripción':
                valorFila = fila.dataset.descripcion ? fila.dataset.descripcion.toLowerCase() : '';
                break;
            default:
                valorFila = '';
        }

        if (valorFila && (valorFila.includes(searchTerm) || searchTerm === '')) {
            fila.style.display = 'grid';
        } else {
            fila.style.display = 'none';
        }
    })
}