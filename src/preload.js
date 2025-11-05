const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    onUpdateTheme: (callback) => {
        const channel = 'update-theme'
        const listener = (event, ...args) => callback(event,...args)
        ipcRenderer.on(channel, listener)
    },

    getEmpleados: () => ipcRenderer.invoke('get-empleados'),
    
    getEmpleadosTabla: (orden) => ipcRenderer.invoke('get-empleados-tabla', orden),

    cargarProductos: (orden) => ipcRenderer.invoke('get-productos', orden),

    eliminarProducto: (id) => ipcRenderer.invoke('eliminar-producto', id) ,

    verificarLogin: (usuario, contrasena) => ipcRenderer.invoke('verificar-login', usuario, contrasena),

    verificarToken: (token) => ipcRenderer.invoke('verificar-token', token),

    onNotificationMessage: (callback) => ipcRenderer.on('show-notification-message', (event, ...args) => callback(event, ...args)),

    sendNotification: (message) => ipcRenderer.send('show-notification-request', message),
    
    abrirVentanaAgregar: () => ipcRenderer.send('abrir-ventana-agregar'),

    abrirVentanaAgregarEmpleado: () => ipcRenderer.send('abrir-ventana-agregar-empleado'), 

    guardarProducto: (datos) => ipcRenderer.invoke('guardar-producto', datos),

    getDepartamentos: () => ipcRenderer.invoke('get-departamentos'),

    seleccionarRutaArchivo: () => ipcRenderer.invoke('open-file-dialog'),
    
    cerrarVentanaModal: () => ipcRenderer.send('cerrar-ventana-modal'),

    onRefrescarProductos: (callback) => ipcRenderer.on('refrescar-productos', callback),

    abrirVentanaModificar: (id) => ipcRenderer.send('abrir-ventana-modificar', id),

    getDatosProductoModificar: () => ipcRenderer.invoke('get-datos-producto-modificar'),

    actualizarProducto: (datos) => ipcRenderer.invoke('actualizar-producto', datos),

    guardarRegistro: (datos) => ipcRenderer.invoke('guardar-registro', datos),

    encriptarContra: (password) => ipcRenderer.invoke('encriptar-contra', password),

    abrirVentanaModificarEmpleado: (id) => ipcRenderer.send('abrir-ventana-modificar-empleado', id),
    
    getDatosEmpleadoModificar: () => ipcRenderer.invoke('get-datos-empleado-modificar'),

    actualizarEmpleado: (datos) => ipcRenderer.invoke('actualizar-empleado', datos),

    eliminarEmpleado: (id) => ipcRenderer.invoke('eliminar-empleado', id) ,

    onRefrescarEmpleados: (callback) => ipcRenderer.on('refrescar-empleados', callback),

    getTickets: (orden) => ipcRenderer.invoke('get-tickets', orden),

    eliminarTicket: (id) => ipcRenderer.invoke('eliminar-ticket', id) ,

    obtenerTicketsPorFecha: (fecha) => ipcRenderer.invoke('obtenerTicketsPorFecha', fecha),

    abrirVentanaReporte: () => ipcRenderer.send('abrir-ventana-reporte'),

    obtenerNombreEmpleado: (id) => ipcRenderer.invoke('obtener-nombre-empleado', id),

})