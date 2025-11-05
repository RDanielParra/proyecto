import { cargarEmpleadosTabla, verificarToken } from './renderer.js'
let orden = 'IdEmpleado'
const tablaCuerpo = document.getElementById('tabla-cuerpo-empleados')
console.log('Tabla cuerpo empleados:', tablaCuerpo)
const barraBusquedaInput = document.getElementById('barraBusqueda')

document.addEventListener('DOMContentLoaded', verificarToken) 

btnEliminar.addEventListener('click', async () => { 
    console.log('Botón Eliminar presionado');

    const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

    if (filaSeleccionada) {
        const IdEmpleado = filaSeleccionada.dataset.IdEmpleado;
        const puestoEmpleado = filaSeleccionada.dataset.Puesto?.toLowerCase();

        if (puestoEmpleado === 'gerente') {
            window.api.sendNotification('Error: No se puede eliminar un empleado con puesto de gerente.');
            console.warn('Intento de eliminar un gerente bloqueado.');
            return;
        }
        
        const confirmado = confirm(`¿Estás seguro de que quieres eliminar el empleado ${IdEmpleado}?`);

        if (confirmado) {
            try {
                const resultado = await window.api.eliminarEmpleado(IdEmpleado);
                
                if (resultado === true) {
                    console.log(`Empleado ${IdEmpleado} eliminado.`);
                    window.api.sendNotification(`Empleado ${IdEmpleado} eliminado con éxito`);
                    renderizarEmpleados(orden);
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
        console.warn('No se ha seleccionado ningún empleado para eliminar.');
        window.api.sendNotification('Error: Debes seleccionar un empleado para eliminar');
    }
})

btnAgregar.addEventListener('click', () => {
    console.log('Botón Agregar presionado');
    window.api.abrirVentanaAgregarEmpleado(); 
    
})

btnModificar.addEventListener('click', () => {
        console.log('Botón Modificar presionado');
        
        const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');

        if (filaSeleccionada) {
            const IdEmpleado = filaSeleccionada.dataset.IdEmpleado;
            console.log(`Modificando empleado: ${IdEmpleado}`);
            
            window.api.abrirVentanaModificarEmpleado(IdEmpleado);

        } else {
            console.warn('No se ha seleccionado ningún empleado para modificar.');
            window.api.sendNotification('Error: Debes seleccionar un empleado para modificar');
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
            renderizarEmpleados(orden)
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

    window.api.onRefrescarEmpleados(() => {
        console.log('Evento de refrescar recibido. Recargando empleados...');
        renderizarEmpleados(orden);
    });

    renderizarEmpleados(orden)
    
})

async function obtenerEmpleados(orden) {
        return cargarEmpleadosTabla(orden).then(response => {
            return response
        })
    }
    

    function crearCelda(content) {
        const celda = document.createElement('div');
        celda.textContent = content;
        return celda;
    }
    
    function renderizarTabla(empleados) {
        // Limpiar filas anteriores
        tablaCuerpo.innerHTML = ''; 

        empleados.forEach(empleado => {
            const fila = document.createElement('div');
            fila.classList.add('tabla-fila');
            
            fila.dataset.IdEmpleado = empleado.IdEmpleado;
            fila.dataset.Usuario = empleado.Usuario
            fila.dataset.Puesto = empleado.Puesto

            fila.appendChild(crearCelda(empleado.IdEmpleado))
            fila.appendChild(crearCelda(empleado.Puesto))
            fila.appendChild(crearCelda(`$${empleado.Sueldo}`))
            fila.appendChild(crearCelda(empleado.RFC))
            fila.appendChild(crearCelda(empleado.Nombre))
            fila.appendChild(crearCelda(empleado.Telefono))
            fila.appendChild(crearCelda(empleado.Usuario))
            fila.appendChild(crearCelda(empleado.Contrasena))

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

        const IdEmpleadoSeleccionado = filaSeleccionada.dataset.IdEmpleado;
        console.log(`Empleado seleccionado: ${IdEmpleadoSeleccionado}`);

    }
    async function renderizarEmpleados (orden) {
        verificarToken()
        try {
            const empleados = await obtenerEmpleados(orden);
            renderizarTabla(empleados);
        } catch (error) {
            console.error('Error al cargar la lista de empleados:', error);
            window.api.sendNotification('Fallo al conectar en la base de datos')
        }
    }

    function filtrarTabla() {
    const searchTerm = barraBusquedaInput.value.toLowerCase().trim();

    const filas = Array.from(tablaCuerpo.querySelectorAll('.tabla-fila'));

    filas.forEach(fila => {
        let valorFila = '';

        if (orden === 'IdEmpleado') {
            valorFila = fila.dataset.IdEmpleado?.toLowerCase() || '';
        } else if (orden === 'Usuario') {
            valorFila = fila.dataset.Usuario?.toLowerCase() || '';
        }

        fila.style.display = valorFila.includes(searchTerm) || searchTerm === '' 
            ? 'grid' 
            : 'none';
    });
}