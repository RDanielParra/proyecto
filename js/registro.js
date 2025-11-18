import { encriptarContra, verificarToken } from "./renderer.js";


document.addEventListener('DOMContentLoaded', async () => {
    verificarToken()
    const btnCancelar = document.getElementById('btnCancelar');

     btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });
});

const formRegister = document.getElementById('formRegister');

formRegister.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const datosResgister = {
        Nombre: document.getElementById('inputNombre').value,
        RFC: document.getElementById('inputRFC').value,
        Sueldo: parseFloat(document.getElementById('inputSueldo').value),
        Telefono: document.getElementById('inputTelefono').value  || null, // Permite nulos
        Usuario: document.getElementById('inputUsuario').value,
        Contrasena: await encriptarContra(document.getElementById('inputContra').value) ,
        Puesto: document.getElementById('inputPuesto').value,
    };
    if (!datosResgister.Nombre || !datosResgister.RFC  || !datosResgister.Sueldo || !datosResgister.Usuario
        || !datosResgister.Contrasena || !datosResgister.Puesto) 
    {
        window.api.sendNotification('Error: Nombre, RFC y Sueldo, Usuario, Contraseña y Puesto son obligatorios.');
        return;
    }
    if (document.getElementById('inputContra').value !== document.getElementById('inputRepContra').value) 
    {
        window.api.sendNotification('Error: La contraseña debe de ser iguakl en ambos apartados.');
        return;
    }

    try {
        const resultado = await window.api.guardarRegistro(datosResgister); 

        if (resultado === true) {
            window.api.sendNotification('Empleado registrado con éxito.');
            document.getElementById("formRegister").reset();
            window.api.cerrarVentanaModal();
        } else {
            window.api.sendNotification(`Error: ${resultado.error || 'Desconocido'}`);
        }
    } catch (error) {
        console.error('Error al enviar datos del empleado:', error);
        window.api.sendNotification('Error fatal al registrar empleado.');
    }
});