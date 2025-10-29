
document.addEventListener('DOMContentLoaded', async () => {
    const formProducto = document.getElementById('formProducto');
    const btnCancelar = document.getElementById('btnCancelar');
    const departamentoSelect = document.getElementById('departamento');
    const btnSeleccionarFoto = document.getElementById('btnSeleccionarFoto');
    const rutaFotoInput = document.getElementById('rutaFoto');
    const previewFoto = document.getElementById('previewFoto');

    const codigoInput = document.getElementById('codigoProducto');
    const precioInput = document.getElementById('precioProducto');
    const descripcionInput = document.getElementById('descripcionProducto');
    const claveSatInput = document.getElementById('claveSat');
    const claveUnidadInput = document.getElementById('claveUnidadMedida');
    const stockInput = document.getElementById('unidadesExistencia');


    // --- 1. Cargar Departamentos Y DATOS DEL PRODUCTO ---
    try {
        // --- Carga de Departamentos (igual) ---
        const departamentos = await window.api.getDepartamentos();
        if (departamentos && !departamentos.error) {
            departamentoSelect.innerHTML = ''; 
            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.IdDepartamento;
                option.textContent = `${dep.IdDepartamento} - ${dep.Descripcion}`; 
                departamentoSelect.appendChild(option);
            });
        } else {
            throw new Error(departamentos.error || 'No se recibieron departamentos.');
        }

        // --- NUEVO: Carga de Datos del Producto ---
        const producto = await window.api.getDatosProductoModificar();
        if (producto && !producto.error) {
            // Rellenar todos los campos del formulario
            codigoInput.value = producto.CodigoProducto;
            codigoInput.readOnly = true; // ¡¡MUY IMPORTANTE!! No dejes que cambien el ID
            codigoInput.classList.add('input-bloqueado'); // <-- CAMBIA A ESTA LÍNEA
            precioInput.value = producto.Precio;
            descripcionInput.value = producto.Descripcion;
            claveSatInput.value = producto.ClaveSAT;
            claveUnidadInput.value = producto.ClaveUnidadMedida;
            stockInput.value = producto.Stock;
            rutaFotoInput.value = producto.RutaFoto;

            // Seleccionar el departamento correcto en el dropdown
            departamentoSelect.value = producto.IdDepartamento;

            // Mostrar la foto si existe
            if (producto.RutaFoto) {
                const rutaNormalizada = producto.RutaFoto.replace(/\\/g, '/');
                previewFoto.innerHTML = `<img src="file://${rutaNormalizada}" alt="Foto del producto">`;
                previewFoto.style.padding = '0';
            }

        } else {
            throw new Error(producto.error || 'No se recibieron datos del producto.');
        }

    } catch (error) {
        console.error('Error al cargar datos:', error);
        window.api.sendNotification(`Error al cargar datos: ${error.message}`);
        // Cierra el modal si no se pudieron cargar los datos
        window.api.cerrarVentanaModal();
    }

    // --- 2. Lógica para el botón Cancelar (igual) ---
    btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });

    // --- 3. Lógica para seleccionar la foto (igual) ---
    btnSeleccionarFoto.addEventListener('click', async () => {
        const rutaSeleccionada = await window.api.seleccionarRutaArchivo();
        if (rutaSeleccionada) {
            const rutaNormalizada = rutaSeleccionada.replace(/\\/g, '/');
            rutaFotoInput.value = rutaNormalizada;
            previewFoto.innerHTML = `<img src="file://${rutaNormalizada}" alt="Foto del producto">`;
            previewFoto.style.padding = '0'; 
        }
    });

    // --- 4. Lógica para ENVIAR EL FORMULARIO (actualizar) ---
    formProducto.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        // Recopila los datos (igual que en agregar)
        const datosProducto = {
            CodigoProducto: codigoInput.value, // El ID no es editable, pero lo necesitamos
            Precio: parseFloat(precioInput.value),
            IdDepartamento: parseInt(departamentoSelect.value),
            Descripcion: descripcionInput.value,
            ClaveSAT: claveSatInput.value || null, 
            ClaveUnidadMedida: claveUnidadInput.value || null,
            Stock: parseInt(stockInput.value),
            RutaFoto: rutaFotoInput.value || null,
        };

        // Validación (igual)
        if (!datosProducto.CodigoProducto || !datosProducto.Precio || isNaN(datosProducto.Stock)) {
            window.api.sendNotification('Error: Código, Precio y Stock son obligatorios.');
            return;
        }

        try {
            // ¡¡CAMBIO!! Llamamos a 'actualizarProducto'
            const resultado = await window.api.actualizarProducto(datosProducto); 

            if (resultado === true) {
                window.api.sendNotification('Producto actualizado con éxito.');
                window.api.cerrarVentanaModal(); // Cierra el modal
            } else {
                window.api.sendNotification(`Error: ${resultado.error || 'No se pudo actualizar'}`);
            }
        } catch (error) {
            console.error('Error al enviar actualización del producto:', error);
            window.api.sendNotification('Error fatal al actualizar producto.');
        }
    });
});