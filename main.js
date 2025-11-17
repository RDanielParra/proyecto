const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { setMainMenu } = require('./src/Menu.js')
const path = require('path')
const { connectionInfo, sql } = require('./connection.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateHash } = require('./encriptar.js')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_por_defecto'

let mainWindow;
let idProductoParaModificar;
let IdEmpleadoModificar; 

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 400,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js')
    }
  })
  setMainMenu(mainWindow)
  mainWindow.maximize()
  mainWindow.loadFile('./html/sesion.html')
  mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
}

app.whenReady().then(() => {
  createWindow()
})

let pool

try{
  pool = sql.createPool(connectionInfo)
} catch (error) {
    throw new Error('Fallo al realizar la conexion')
}

ipcMain.handle('get-empleados', async () => {
  try{
    const [rows] = await pool.query('SELECT Usuario, Contrasena, IdEmpleado, Nombre FROM Empleado')
    return rows
  } catch (error) {
    console.log('ERROR en la consulta: ', error)
  }
})

ipcMain.handle('encriptar-contra', async (event, password) => {
    const hash = await generateHash(password)
    return hash
})

ipcMain.handle('verificar-login', async (event, usuario, contrasena) => {
  const query = 'SELECT IdEmpleado, Usuario, Contrasena, Puesto FROM Empleado WHERE Usuario = ?'
  let results
  try {
    const [rows] = await pool.query(query, [usuario])
    results = rows
  } catch (error) {
    console.log('Error de bd al verificar usuario: ', error)
  }

  if(results.length === 0) {
    console.log(`Intento fallido no se encontro el usuario: ${usuario}`)
    return null
  }

  const empleado = results[0]
  try {
    const match = await bcrypt.compare(contrasena, empleado.Contrasena)

    if(match) {
      console.log(`Login exitoso para el usuario: ${usuario}`)
      
      const payload = {
        id: empleado.IdEmpleado,
        usuario: empleado.Usuario,
        puesto: empleado.Puesto
      }

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '9h'
      })

      return token
    } else {
      console.log(`Intento de login fallido: Contraseña incorrecta para ${usuario}, contrasena: ${contrasena}, ${empleado.Contrasena}`)
      return null
    }
  } catch (error) {
    console.error("Error al comparar contraseñas (bcrypt o JWT):", error);
    return null;
  }
})

function verificarToken(token) {
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        return null; 
    }
}

ipcMain.handle('verificar-token', async (event, token) => {
    const userPayload = verificarToken(token);
    if (!userPayload) {
      return false
    }
    return true
});

function createNotificationWindow(message) {
    const notificationWindow = new BrowserWindow({
        width: 300,
        height: 100,
        resizable: false,
        frame: false,
        show: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        focusable: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    notificationWindow.loadFile('./html/notification.html');
    const display = require('electron').screen.getPrimaryDisplay();
    const x = display.bounds.width - 320;
    const y = display.bounds.height - 120;
    notificationWindow.setPosition(x, y);
    notificationWindow.show();
    notificationWindow.webContents.on('did-finish-load', () => {
        notificationWindow.webContents.send('show-notification-message', message);
    });
    setTimeout(() => {
        notificationWindow.close();
    }, 3000);
    return notificationWindow;
}

ipcMain.on('show-notification-request', (event, message) => {
  createNotificationWindow(message)
});

ipcMain.handle('get-productos', async (event, orden) => {
  const query = `SELECT * FROM Producto ORDER BY ${orden}`
  try {
    const [rows] = await pool.query(query)
    return rows
  } catch (error) {
    console.log(error)
  }
})

ipcMain.handle('get-empleados-tabla', async (event, orden) => {
  const query = `SELECT * FROM empleado ORDER BY ${orden}`
  try {
    const [rows] = await pool.query(query)
    return rows
  } catch (error) {
    console.log(error)
  }
})

ipcMain.handle('eliminar-producto', async (event, idProducto) => {
    const query = 'DELETE FROM Producto WHERE CodigoProducto = ?';
    try {
        const [result] = await pool.query(query, [idProducto]);
        
        if (result.affectedRows > 0) {
            console.log(`Producto ${idProducto} eliminado con éxito.`);
            return true; 
        } else {
            console.log(`No se encontró el producto ${idProducto} para eliminar.`);
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return { error: error.message }; 
    }
})
 
ipcMain.on('abrir-ventana-agregar', () => {
    const agregarWindow = new BrowserWindow({
        width: 500,
        height: 600,
        parent: mainWindow, 
        modal: true, 
        show: false,
        maximizable: false,
        frame: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: true,

        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js') 
        }
    });

    agregarWindow.loadFile('./html/agregar-producto.html'); 
    agregarWindow.setMenu(null);
    agregarWindow.once('ready-to-show', () => {
        agregarWindow.show();
    });
})

ipcMain.on('abrir-ventana-agregar-empleado', () => {
    const agregarWindow = new BrowserWindow({
        width: 700,
        height: 600,
        parent: mainWindow, 
        modal: true, 
        show: false,
        maximizable: false,
        frame: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: true,

        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js') 
        }
    });

    agregarWindow.loadFile('./html/register.html'); 
    agregarWindow.setMenu(null);
    agregarWindow.once('ready-to-show', () => {
        agregarWindow.show();
    });
})

ipcMain.handle('guardar-producto', async (event, producto) => {
    const query = 'INSERT INTO Producto (CodigoProducto, Precio, IdDepartamento, Descripcion, ClaveSAT, ClaveUnidadMedida, Stock, RutaFoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    const valores = [
        producto.CodigoProducto,
        producto.Precio,
        producto.IdDepartamento,
        producto.Descripcion,
        producto.ClaveSAT,
        producto.ClaveUnidadMedida,
        producto.Stock,
        producto.RutaFoto
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {
            console.log(`Producto ${producto.CodigoProducto} guardado con éxito.`);
            
            mainWindow.webContents.send('refrescar-productos'); 
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        return { error: error.message };
    }
});

ipcMain.handle('get-departamentos', async () => {

    const query = 'SELECT IdDepartamento, Descripcion FROM departamento'; 
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        return { error: error.message };
    }
});

ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Seleccionar foto del producto',
        buttonLabel: 'Seleccionar',
        properties: ['openFile'],
        filters: [
            { name: 'Imágenes', extensions: ['jpg', 'png', 'gif', 'jpeg'] }
        ]
    });

    if (canceled || filePaths.length === 0) {
        return null;
    } else {
        return filePaths[0];
    }
});

ipcMain.on('abrir-ventana-modificar', (event, idProducto) => {
    idProductoParaModificar = idProducto; 

    const modificarWindow = new BrowserWindow({
        width: 500,
        height: 600,
        parent: mainWindow, 
        modal: true, 
        show: false,
        maximizable: false,
        frame: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js') 
        }
    });

    modificarWindow.loadFile('./html/modificar-producto.html');
    modificarWindow.setMenu(null); 
    
    modificarWindow.once('ready-to-show', () => {
        modificarWindow.show();
    });
});

ipcMain.handle('get-datos-producto-modificar', async () => {
    if (!idProductoParaModificar) {
        return { error: 'No se especificó ningún ID de producto.' };
    }
    
    const query = 'SELECT * FROM Producto WHERE CodigoProducto = ?';
    try {
        const [rows] = await pool.query(query, [idProductoParaModificar]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return { error: 'Producto no encontrado.' };
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        return { error: error.message };
    }
});

ipcMain.handle('actualizar-producto', async (event, producto) => {
    const query = `UPDATE Producto SET Precio = ?, IdDepartamento = ?, Descripcion = ?, ClaveSAT = ?, ClaveUnidadMedida = ?, Stock = ?, RutaFoto = ? WHERE CodigoProducto = ? `;
    
    const valores = [
        producto.Precio,
        producto.IdDepartamento,
        producto.Descripcion,
        producto.ClaveSAT,
        producto.ClaveUnidadMedida,
        producto.Stock,
        producto.RutaFoto,
        producto.CodigoProducto
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {
            console.log(`Producto ${producto.CodigoProducto} actualizado con éxito.`);
            
            mainWindow.webContents.send('refrescar-productos'); 
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return { error: error.message };
    }
});

ipcMain.on('cerrar-ventana-modal', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
        window.close();
    }
});

ipcMain.handle('guardar-registro', async (event, empleado) => {
    const query = 'INSERT INTO empleado (Puesto, Sueldo, RFC, Nombre, Telefono, Usuario, Contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    const valores = [
        empleado.Puesto,
        empleado.Sueldo,
        empleado.RFC,
        empleado.Nombre,
        empleado.Telefono,
        empleado.Usuario,
        empleado.Contrasena,
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {     
            
            mainWindow.webContents.send('refrescar-empleados'); 
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al guardar el empleado:', error);
        return { error: error.message };
    }
});

ipcMain.on('abrir-ventana-modificar-empleado', (event, IdEmpleado) => {
    IdEmpleadoModificar = IdEmpleado; 

    const modificarWindow = new BrowserWindow({
        width: 700,
        height: 600,
        parent: mainWindow, 
        modal: true, 
        show: false,
        maximizable: false,
        frame: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js') 
        }
    });

    modificarWindow.loadFile('./html/modificar-empleado.html');
    modificarWindow.setMenu(null); 
    
    modificarWindow.once('ready-to-show', () => {
        modificarWindow.show();
    });
});

ipcMain.handle('get-datos-empleado-modificar', async () => {
    if (!IdEmpleadoModificar) {
        return { error: 'No se especificó ningún ID de empleado.' };
    }
    
    const query = 'SELECT * FROM empleado WHERE IdEmpleado = ?';
    try {
        const [rows] = await pool.query(query, [IdEmpleadoModificar]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return { error: 'Empleado no encontrado.' };
        }
    } catch (error) {
        console.error('Error al obtener datos del empleado:', error);
        return { error: error.message };
    }
});

ipcMain.handle('actualizar-empleado', async (event, empleado) => {
    const query = `UPDATE empleado SET Puesto = ?, Sueldo = ?, RFC = ?, Nombre = ?, Telefono = ?, Usuario = ? WHERE IdEmpleado = ?`;
    
    const valores = [
        empleado.Puesto,
        empleado.Sueldo,
        empleado.RFC,
        empleado.Nombre,
        empleado.Telefono,
        empleado.Usuario,
        empleado.IdEmpleado
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {
            console.log(`Empleado ${empleado.IdEmpleado} actualizado con éxito.`);
            
            mainWindow.webContents.send('refrescar-empleados'); 
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        return { error: error.message };
    }
});

ipcMain.handle('eliminar-empleado', async (event, IdEmpleado) => {
    const query = 'DELETE FROM empleado WHERE IdEmpleado = ?';
    try {
        const [result] = await pool.query(query, [IdEmpleado]);
        
        if (result.affectedRows > 0) {
            console.log(`Empleado ${IdEmpleado} eliminado con éxito.`);
            return true; 
        } else {
            console.log(`No se encontró el producto ${IdEmpleado} para eliminar.`);
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        return { error: error.message }; 
    }
})

ipcMain.handle('get-tickets', async (event, orden) => {
  const query = `SELECT * FROM ticket ORDER BY ${orden}`
  try {
    const [rows] = await pool.query(query)
    return rows
  } catch (error) {
    console.log(error)
  }
})

ipcMain.handle('eliminar-ticket', async (event, NumeroTicket) => {
    const query = 'DELETE FROM ticket WHERE NumeroTicket = ?';
    try {
        const [result] = await pool.query(query, [NumeroTicket]);
        
        if (result.affectedRows > 0) {
            console.log(`Venta ${NumeroTicket} cancelada con éxito.`);
            return true; 
        } else {
            console.log(`No se encontró la venta ${NumeroTicket} para cancelar.`);
            return false;
        }
    } catch (error) {
        console.error('Error al cancelar la venta:', error);
        return { error: error.message }; 
    }
})

ipcMain.handle('obtenerTicketsPorFecha', async (event, fecha) => {
  try {
    const query = 'SELECT NumeroTicket, Subtotal, IdEmpleado, FechaHora FROM ticket WHERE DATE(FechaHora) = ? ORDER BY FechaHora ASC';
    const [rows] = await pool.query(query, [fecha]);
    console.log('Tickets obtenidos para la fecha', fecha, ':', rows);
    return rows;
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    return { error: error.message };
  }
});

ipcMain.on('abrir-ventana-reporte', () => {
    let agregarWindow = new BrowserWindow({
        width: 500,
        height: 600,
        parent: mainWindow, 
        modal: true, 
        show: false,
        maximizable: false,
        frame: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: true,

        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js') 
        }
    });
    agregarWindow.loadFile('./html/reporte.html');
    agregarWindow.setMenu(null); 
    
    
    agregarWindow.once('ready-to-show', () => {
        agregarWindow.show();
    });
});

// ===================================================
// MANEJADORES PARA LA VENTANA DE CAJA
// ===================================================

ipcMain.handle('registrar-venta', async (event, datosVenta) => {
    
    let connection;
    try {
        connection = await pool.getConnection(); 
    } catch (error) {
        console.error("Error al obtener conexión:", error);
        return { success: false, error: "Error de conexión a la base de datos." };
    }

    try {
        await connection.beginTransaction();

        const [ticketResult] = await connection.execute(
            'INSERT INTO ticket (Subtotal, IdEmpleado, MetodoPago, FechaHora) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [datosVenta.total, datosVenta.idEmpleado, datosVenta.metodo]
        );

        const nuevoNumeroTicket = ticketResult.insertId;

        const promesasVenta = datosVenta.items.map(async (item) => {
            
            await connection.execute(
                'INSERT INTO venta (CodigoProducto, NumeroTicket, Cantidad, Subtotal) VALUES (?, ?, ?, ?)',
                [item.codigo, nuevoNumeroTicket, item.cantidad, (item.precio * item.cantidad)]
            );

            const [updateResult] = await connection.execute(
                'UPDATE producto SET Stock = Stock - ? WHERE CodigoProducto = ? AND Stock >= ?',
                [item.cantidad, item.codigo, item.cantidad]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error(`Stock insuficiente para el producto ${item.codigo}`);
            }
        });

        await Promise.all(promesasVenta);
        await connection.commit();
        return { success: true, numeroTicket: nuevoNumeroTicket };

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error en la transacción de venta:', error);
        return { success: false, error: error.message || "Error desconocido." };

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

ipcMain.handle('solicitar-impresion', async (event) => {
    if (!mainWindow) {
        console.error("mainWindow no está definida.");
        return false;
    }

    try {
        const { response } = await dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['Imprimir Ticket', 'No Imprimir'],
            title: 'Confirmar Impresión',
            message: '¿Deseas imprimir el ticket de venta?',
            defaultId: 0,
            cancelId: 1
        });

        if (response === 0) {
            event.sender.print({ silent: false, printBackground: false }, (success, error) => {
                if (!success) console.error('Error al imprimir:', error);
            });
            return true;
        }

    } catch (error) {
        console.error("Error al mostrar el diálogo de impresión:", error);
        return false;
    }
    
    return false;
});

ipcMain.handle('generar-corte-parcial', async (event, idEmpleado) => {
    if (!idEmpleado) {
        return { success: false, error: "ID de empleado no proporcionado." };
    }

    const totalQuery = 'SELECT COUNT(*) as numeroTickets, SUM(Subtotal) as totalVentas FROM ticket WHERE IdEmpleado = ? AND DATE(FechaHora) = CURDATE()';
    
    const detalleQuery = 'SELECT MetodoPago, SUM(Subtotal) as totalMetodo, COUNT(*) as numTicketsMetodo FROM ticket WHERE IdEmpleado = ? AND DATE(FechaHora) = CURDATE() GROUP BY MetodoPago';

    try {
        const [totalResults] = await pool.query(totalQuery, [idEmpleado]);
        const [detalleResults] = await pool.query(detalleQuery, [idEmpleado]);
        
        return { 
            success: true, 
           data: {
                resumen: totalResults[0],
                detalle: detalleResults
            } 
        };
    } catch (error) {
        console.error("Error en DB (Corte Parcial):", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('generar-corte-final', async (event) => {
    const totalQuery = 'SELECT COUNT(*) as numeroTickets, SUM(Subtotal) as totalVentas FROM ticket WHERE DATE(FechaHora) = CURDATE()';
    
    const detalleQuery = 'SELECT MetodoPago, SUM(Subtotal) as totalMetodo, COUNT(*) as numTicketsMetodo FROM ticket WHERE DATE(FechaHora) = CURDATE() GROUP BY MetodoPago';

    try {
        const [totalResults] = await pool.query(totalQuery);
        const [detalleResults] = await pool.query(detalleQuery);
        
        return { 
            success: true, 
            data: {
                resumen: totalResults[0],
                detalle: detalleResults
            } 
        };
    } catch (error) {
        console.error("Error en DB (Corte Final):", error);
        return { success: false, error: error.message };
    }
});