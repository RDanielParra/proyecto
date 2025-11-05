// No necesitas importar nada, 'window.api' ya está disponible gracias al preload

document.addEventListener('DOMContentLoaded', async () => {
    // --- Obtener elementos del DOM ---
    const formProducto = document.getElementById('formProducto');
    const btnCancelar = document.getElementById('btnCancelar');
    const departamentoSelect = document.getElementById('departamento');
    const btnSeleccionarFoto = document.getElementById('btnSeleccionarFoto');
    const rutaFotoInput = document.getElementById('rutaFoto');
    const previewFoto = document.getElementById('previewFoto');

    // --- 1. Cargar Departamentos al iniciar ---
    try {
        const departamentos = await window.api.getDepartamentos();
        if (departamentos && !departamentos.error) {
            // Limpiar opciones de ejemplo
            departamentoSelect.innerHTML = ''; 
            
            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.IdDepartamento;
                // Asumiendo que la columna se llama 'Nombre'
                option.textContent = `${dep.IdDepartamento} - ${dep.Descripcion}`; 
                departamentoSelect.appendChild(option);
            });
        } else {
            throw new Error(departamentos.error || 'No se recibieron departamentos.');
        }
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
        window.api.sendNotification('Error al cargar departamentos.');
    }

    // --- 2. Lógica para el botón Cancelar ---
    btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });

    // --- 3. Lógica para seleccionar la foto ---
    btnSeleccionarFoto.addEventListener('click', async () => {
        const rutaSeleccionada = await window.api.seleccionarRutaArchivo();
        
        if (rutaSeleccionada) {
            // Reemplaza \ con / para que funcione en HTML/CSS
            const rutaNormalizada = rutaSeleccionada.replace(/\\/g, '/');
            
            rutaFotoInput.value = rutaNormalizada;
            
            // Mostrar la previsualización
            // 'file://' es importante para que Electron muestre archivos locales
            previewFoto.innerHTML = `<img src="file://${rutaNormalizada}" alt="Foto del producto">`;
            previewFoto.style.padding = '0'; // Quitar padding si hay imagen
        }
    });

    // --- 4. Lógica para enviar el formulario ---
    formProducto.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se recargue

        // Recopila todos los datos del formulario
        const datosProducto = {
            CodigoProducto: document.getElementById('codigoProducto').value,
            Precio: parseFloat(document.getElementById('precioProducto').value),
            IdDepartamento: parseInt(document.getElementById('departamento').value),
            Descripcion: document.getElementById('descripcionProducto').value,
            ClaveSAT: document.getElementById('claveSat').value || null, // Permite nulos
            ClaveUnidadMedida: document.getElementById('claveUnidadMedida').value || null,
            Stock: parseInt(document.getElementById('unidadesExistencia').value),
            RutaFoto: rutaFotoInput.value || null,
        };

        // Validación simple
        if (!datosProducto.CodigoProducto || !datosProducto.Precio || !datosProducto.Stock) {
            window.api.sendNotification('Error: Código, Nombre, Precio y Stock son obligatorios.');
            return;
        }

        try {
            const resultado = await window.api.guardarProducto(datosProducto); 

            if (resultado === true) {
                window.api.sendNotification('Producto registrado con éxito.');
                window.api.cerrarVentanaModal(); // Cierra el modal automáticamente
            } else {
                // Muestra el error específico de la base de datos (ej. Llave duplicada)
                window.api.sendNotification(`Error: ${resultado.error || 'Desconocido'}`);
            }
        } catch (error) {
            console.error('Error al enviar datos del producto:', error);
            window.api.sendNotification('Error fatal al registrar producto.');
        }
    });
});