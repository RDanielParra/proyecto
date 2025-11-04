import { encriptarContra, verificarToken } from "./renderer.js";
document.addEventListener('DOMContentLoaded', async () => {
    
    const inputNombre = document.getElementById('inputNombre');
    const inputRFC = document.getElementById('inputRFC');
    const inputSueldo = document.getElementById('inputSueldo');
    const inputTelefono = document.getElementById('inputTelefono');
    const inputUsuario = document.getElementById('inputUsuario');
    const inputPuesto = document.getElementById('inputPuesto');
    const formRegister = document.getElementById('formRegister');
    const inputIdEmpleado = document.getElementById('inputIdEmpleado');
    verificarToken()

     // --- 2. Lógica para el botón Cancelar (igual) ---
    const btnCancelar = document.getElementById('btnCancelar');
     btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });

   try {
        // --- NUEVO: Carga de Datos del Producto ---
        const empleado = await window.api.getDatosEmpleadoModificar();
        if (empleado && !empleado.error) {
            // Rellenar todos los campos del formulario
            inputIdEmpleado.value = empleado.IdEmpleado;
            inputNombre.value = empleado.Nombre;
            inputRFC.value = empleado.RFC;
            inputSueldo.value = empleado.Sueldo;
            inputTelefono.value = empleado.Telefono;
            inputUsuario.value = empleado.Usuario;
            inputPuesto.value = empleado.Puesto;

        } else {
            throw new Error(empleado.error || 'No se recibieron datos del empleado.');
        }

    } catch (error) {
        console.error('Error al cargar datos:', error);
        window.api.sendNotification(`Error al cargar datos: ${error.message}`);
        // Cierra el modal si no se pudieron cargar los datos
        window.api.cerrarVentanaModal();
    }
    
    formRegister.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se recargue
        // Recopila todos los datos del formulario
        const datosResgister = {
            IdEmpleado: inputIdEmpleado.value,
            Nombre: document.getElementById('inputNombre').value,
            RFC: document.getElementById('inputRFC').value,
            Sueldo: parseFloat(document.getElementById('inputSueldo').value),
            Telefono: document.getElementById('inputTelefono').value  || null, // Permite nulos
            Usuario: document.getElementById('inputUsuario').value,
            Puesto: document.getElementById('inputPuesto').value,
        };
            // Validación simple
        if (!datosResgister.Nombre || !datosResgister.RFC  || !datosResgister.Sueldo || !datosResgister.Usuario || !datosResgister.Puesto) 
        {
            window.api.sendNotification('Error: Nombre, RFC y Sueldo, Usuario, y Puesto son obligatorios.');
            return;
        }

        try {
            const resultado = await window.api.actualizarEmpleado(datosResgister); 
            console.log('Resultado de actualizarEmpleado:', resultado);

            if (resultado === true) {
                window.api.sendNotification('Empleado actualizado con éxito.');
                window.api.cerrarVentanaModal();
            } else {
                // Muestra el error específico de la base de datos (ej. Llave duplicada)
                window.api.sendNotification(`Error: ${resultado.error || 'Desconocido'}`);
                console.error('Error al actualizar empleado:', resultado);
            }
        } catch (error) {
            console.error('Error al enviar datos del empleado:', error);
            window.api.sendNotification('Error fatal al registrar empleado.');
        }
    });
});

