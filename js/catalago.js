import { cargarProductos, verificarToken } from './renderer.js'
let orden = 'CodigoProducto'
const tablaCuerpo = document.getElementById('tabla-cuerpo-productos')
const barraBusquedaInput = document.getElementById('barraBusqueda')



document.addEventListener('DOMContentLoaded', verificarToken)

btnEliminar.addEventListener('click', async () => { 
    console.log('Botón Eliminar presionado');

    const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

    if (filaSeleccionada) {
        const idProducto = filaSeleccionada.dataset.codigoProducto;
        
        const confirmado = confirm(`¿Estás seguro de que quieres eliminar el producto ${idProducto}?`);

        if (confirmado) {
            try {
                const resultado = await window.api.eliminarProducto(idProducto);
                
                if (resultado === true) {
                    console.log(`Producto ${idProducto} eliminado.`);
                    window.api.sendNotification(`Producto ${idProducto} eliminado con éxito`);
                    renderizarProductos(orden);
                } else if (resultado.error) {
                    console.error('Error de BD:', resultado.error);
                    window.api.sendNotification(`Error: No se pudo eliminar. ${resultado.error}`);
                } else {
                    window.api.sendNotification('Error: El producto no fue encontrado.');
                }
            } catch (error) {
                console.error('Error fatal al llamar a eliminarProducto:', error);
                window.api.sendNotification('Error: No se pudo eliminar el producto');
            }
        } else {
            console.log('Eliminación cancelada por el usuario.');
        }
    } else {
        console.warn('No se ha seleccionado ningún producto para eliminar.');
        window.api.sendNotification('Error: Debes seleccionar un producto para eliminar');
    }
})

btnAgregar.addEventListener('click', () => {
    console.log('Botón Agregar presionado');
    window.api.abrirVentanaAgregar(); 
})

btnModificar.addEventListener('click', () => {
        console.log('Botón Modificar presionado');
        
        // 1. Encontrar la fila que está seleccionada
        const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

        if (filaSeleccionada) {
            // 2. Obtener el ID del producto desde el dataset
            const idProducto = filaSeleccionada.dataset.codigoProducto;
            console.log(`Modificando producto: ${idProducto}`);
            
            // 3. ¡Aquí está la magia! Llama a la nueva función de la API
            //    que crearemos en preload.js.
            window.api.abrirVentanaModificar(idProducto);

        } else {
            // 4. Si no hay nada seleccionado, avisar al usuario
            console.warn('No se ha seleccionado ningún producto para modificar.');
            window.api.sendNotification('Error: Debes seleccionar un producto para modificar');
        }
    });


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
        console.log('Evento de refrescar recibido. Recargando productos...');
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
        // Limpiar filas anteriores
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

        const codigoSeleccionado = filaSeleccionada.dataset.codigoProducto;
        console.log(`Producto seleccionado: ${codigoSeleccionado}`);

    }
    async function renderizarProductos (orden) {
        verificarToken()
        try {
            const productos = await obtenerProductos(orden);
            renderizarTabla(productos);
        } catch (error) {
            console.error('Error al cargar la lista de productos:', error);
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
                valorFila = fila.dataset.descripcion.toLowerCase();
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