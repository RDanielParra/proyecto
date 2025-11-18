import { cargarEmpleadosTabla, verificarToken } from './renderer.js'
let orden = 'IdEmpleado'
const tablaCuerpo = document.getElementById('tabla-cuerpo-empleados')
const barraBusquedaInput = document.getElementById('barraBusqueda')

document.addEventListener('DOMContentLoaded', verificarToken)

document.addEventListener('DOMContentLoaded', () => {
    const btnEliminar = document.getElementById('btnEliminar')
    const btnAgregar = document.getElementById('btnAgregar')
    const btnModificar = document.getElementById('btnModificar')

    if (btnEliminar) {
    btnEliminar.addEventListener('click', async () => { 
        
        const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');
        const inputParaEnfocar = barraBusquedaInput; 
        
        let tituloDialogo = '';
        let mensajeDialogo = '';

        if (!filaSeleccionada) {
            await window.api.mostrarDialogoContextual({
                titulo: 'Acción Requerida',
                mensaje: 'Debes seleccionar un empleado para eliminar.'
            });
            if (inputParaEnfocar) inputParaEnfocar.focus();
            return; 
        }

        const IdEmpleado = filaSeleccionada.dataset.IdEmpleado;
        const puestoEmpleado = filaSeleccionada.dataset.Puesto?.toLowerCase();

        if (puestoEmpleado === 'gerente') {
            await window.api.mostrarDialogoContextual({
                titulo: 'Acción No Permitida',
                mensaje: 'No se puede eliminar un empleado con puesto de Gerente.'
            });
            if (inputParaEnfocar) inputParaEnfocar.focus();
            return;
        }
        
        const confirmado = confirm(`¿Estás seguro de que quieres eliminar el empleado ${IdEmpleado}?`);

        if (confirmado) {
            try {
                const resultado = await window.api.eliminarEmpleado(IdEmpleado);
                
                if (resultado === true) {
                    tituloDialogo = 'Empleado Eliminado';
                    mensajeDialogo = `El empleado ${IdEmpleado} ha sido eliminado con éxito.`;
                    renderizarEmpleados(orden); 
                } else if (resultado.error) {
                    tituloDialogo = 'Error al Eliminar';
                    mensajeDialogo = `No se pudo eliminar: ${resultado.error}`;
                } else {
                    tituloDialogo = 'Error';
                    mensajeDialogo = 'El empleado no fue encontrado.';
                }
            } catch (error) {
                tituloDialogo = 'Error de Conexión';
                mensajeDialogo = `Error: ${error.message || 'No se pudo eliminar el empleado'}`;
            }
        } else {
            tituloDialogo = 'Aviso';
            mensajeDialogo = 'Se canceló la acción.';
       }
        
        await window.api.mostrarDialogoContextual({
            titulo: tituloDialogo,
            mensaje: mensajeDialogo
        });
        if (inputParaEnfocar) inputParaEnfocar.focus();
    });
}

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            window.api.abrirVentanaAgregarEmpleado(); 
        })
    }

    if (btnModificar) {
        btnModificar.addEventListener('click', () => {
            const filaSeleccionada = document.querySelector('.tabla-fila.fila-seleccionada');
            
            if (filaSeleccionada) {
                const IdEmpleado = filaSeleccionada.dataset.IdEmpleado;
                const puestoEmpleado = filaSeleccionada.dataset.Puesto?.toLowerCase();

                    if (puestoEmpleado === 'gerente') {
                        window.api.sendNotification('Error: No se puede modificar un empleado con puesto de gerente.');
                        return;
                    }
                window.api.abrirVentanaModificarEmpleado(IdEmpleado);
            } else {
                window.api.sendNotification('Error: Debes seleccionar un empleado para modificar');
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
                renderizarEmpleados(orden)
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

    window.api.onRefrescarEmpleados(() => {
        renderizarEmpleados(orden);
        if (barraBusquedaInput) {
            barraBusquedaInput.focus()
        }
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
    tablaCuerpo.innerHTML = ''; 

    empleados.forEach(empleado => {
        const fila = document.createElement('div');
        fila.classList.add('tabla-fila');
        
        fila.dataset.IdEmpleado = empleado.IdEmpleado;
        fila.dataset.Usuario = empleado.Usuario
        fila.dataset.Puesto = empleado.Puesto
        fila.dataset.Nombre = empleado.Nombre

        fila.appendChild(crearCelda(empleado.IdEmpleado))
        fila.appendChild(crearCelda(empleado.Puesto))
        fila.appendChild(crearCelda(`$${empleado.Sueldo}`))
        fila.appendChild(crearCelda(empleado.RFC))
        fila.appendChild(crearCelda(empleado.Nombre))
        fila.appendChild(crearCelda(empleado.Telefono))
        fila.appendChild(crearCelda(empleado.Usuario))

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

async function renderizarEmpleados (orden) {
    verificarToken()
    try {
        const empleados = await obtenerEmpleados(orden);
        renderizarTabla(empleados);
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
            case 'id':
                valorFila = fila.dataset.IdEmpleado?.toLowerCase() || '';
                break;
            case 'usuario':
                valorFila = fila.dataset.Usuario?.toLowerCase() || '';
                break;
            case 'puesto':
                valorFila = fila.dataset.Puesto?.toLowerCase() || '';
                break;
            case 'nombre':
                valorFila = fila.dataset.Nombre?.toLowerCase() || '';
                break;
            default:
                valorFila = fila.dataset.Nombre?.toLowerCase() || '';
        }

        fila.style.display = valorFila.includes(searchTerm) || searchTerm === '' 
            ? 'grid' 
            : 'none';
    });
}