const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { setMainMenu } = require('./src/Menu.js')
const path = require('path')
const { connectionInfo, sql } = require('./connection.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateHash } = require('./encriptar.js')

let mainWindow;
let idProductoParaModificar;

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
    const [rows] = await pool.query('SELECT Usuario, Contrasena FROM Empleado')
    return rows
  } catch (error) {
    console.log('ERROR en la consulta: ', error)
  }
})

const JWT_SECRET = 'jD/g7I0h4sD8Xg4sD8Xg7I0h4sD8Xg4sD8Xg7I0h4sD8Xg4sD8Xg=='

ipcMain.handle('encriptar-contra', async (event, password) => {
    const hash = await generateHash(password)
    return hash
})

ipcMain.handle('verificar-login', async (event, usuario, contrasena) => {
  const query = 'SELECT IdEmpleado, Usuario, Contrasena, Puesto FROM Empleado WHERE Usuario = ?'
  let results
  //Verificacion de Usuario
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
  //verificacion de contraseña
  try {

    
    const match = await bcrypt.compare(contrasena, empleado.Contrasena)

    if(match) {
      console.log(`Login exitoso para el usuario: ${usuario}`)
      
      //creacion de token
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
 //Para el botón de agregar producto ---------------------------------
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
    agregarWindow.setMenu(null); // Opcional: quitar menú
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
    agregarWindow.setMenu(null); // Opcional: quitar menú
    agregarWindow.once('ready-to-show', () => {
        agregarWindow.show();
    });
})

ipcMain.handle('guardar-producto', async (event, producto) => {

    const query = `
        INSERT INTO Producto 
        (CodigoProducto, Precio, IdDepartamento, Descripcion, ClaveSAT, ClaveUnidadMedida, Stock, RutaFoto) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Los valores deben estar en el mismo orden que las columnas
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
            
            // ¡Importante! Avisa a la ventana principal que debe refrescarse
            mainWindow.webContents.send('refrescar-productos'); 
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        return { error: error.message }; // Envía el mensaje de error al frontend
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
        return null; // El usuario canceló
    } else {
        return filePaths[0]; // Devuelve la ruta del archivo seleccionado
    }
});
//-------------------------------------------------------------------^^^^^
//Para el botón de modificar producto------------------------------------
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

    // Cargas el HTML del formulario (que debes crear)
    modificarWindow.loadFile('./html/modificar-producto.html'); // <-- Nuevo HTML
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
            return rows[0]; // Devuelve el objeto del producto
        } else {
            return { error: 'Producto no encontrado.' };
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        return { error: error.message };
    }
});

ipcMain.handle('actualizar-producto', async (event, producto) => {
    // La variable 'producto' es el objeto que enviaste desde modificar-producto.js
    const query = `
        UPDATE Producto SET
            Precio = ?,
            IdDepartamento = ?,
            Descripcion = ?,
            ClaveSAT = ?,
            ClaveUnidadMedida = ?,
            Stock = ?,
            RutaFoto = ?
        WHERE CodigoProducto = ? 
    `;
    
    // ¡OJO AL ORDEN! El CodigoProducto va al final para el WHERE
    const valores = [
        producto.Precio,
        producto.IdDepartamento,
        producto.Descripcion,
        producto.ClaveSAT,
        producto.ClaveUnidadMedida,
        producto.Stock,
        producto.RutaFoto,
        producto.CodigoProducto // <-- Este es para el WHERE
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {
            console.log(`Producto ${producto.CodigoProducto} actualizado con éxito.`);
            
            // Avisa a la ventana principal que debe refrescarse
            mainWindow.webContents.send('refrescar-productos'); 
            
            return true;
        }
        return false; // No se actualizó (quizás el ID no existía)
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return { error: error.message }; // Envía el mensaje de error
    }
});

ipcMain.on('cerrar-ventana-modal', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
        window.close();
    }
});

ipcMain.handle('guardar-registro', async (event, empleado) => {

    const query = `
        INSERT INTO empleado 
        (Puesto, Sueldo, RFC, Nombre, Telefono, Usuario, Contrasena) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Los valores deben estar en el mismo orden que las columnas
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
        return { error: error.message }; // Envía el mensaje de error al frontend
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

    // Cargas el HTML del formulario (que debes crear)
    modificarWindow.loadFile('./html/modificar-empleado.html'); // <-- Nuevo HTML
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
            return rows[0]; // Devuelve el objeto del producto
        } else {
            return { error: 'Empleado no encontrado.' };
        }
    } catch (error) {
        console.error('Error al obtener datos del empleado:', error);
        return { error: error.message };
    }
});

ipcMain.handle('actualizar-empleado', async (event, empleado) => {
    // La variable 'empleado' es el objeto que enviaste desde modificar-empleado.js
    const query = `
        UPDATE empleado SET
            Puesto = ?,
            Sueldo = ?,
            RFC = ?,
            Nombre = ?,
            Telefono = ?,
            Usuario = ?
        WHERE IdEmpleado = ?
    `;
    
    // ¡OJO AL ORDEN! El CodigoProducto va al final para el WHERE
    const valores = [
        empleado.Puesto,
        empleado.Sueldo,
        empleado.RFC,
        empleado.Nombre,
        empleado.Telefono,
        empleado.Usuario,
        empleado.IdEmpleado // <-- Este es para el WHERE
    ];

    try {
        const [result] = await pool.query(query, valores);
        if (result.affectedRows > 0) {
            console.log(`Empleado ${empleado.IdEmpleado} actualizado con éxito.`);
            
            // Avisa a la ventana principal que debe refrescarse
            mainWindow.webContents.send('refrescar-empleados'); 
            
            return true;
        }
        return false; // No se actualizó (quizás el ID no existía)
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        return { error: error.message }; // Envía el mensaje de error
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
    const query = `
      SELECT NumeroTicket, Subtotal, IdEmpleado, Fecha
      FROM ticket
      WHERE DATE(Fecha) = ?
      ORDER BY Fecha ASC
    `;
    const [rows] = await pool.query(query, [fecha]);
    return rows;
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    return { error: error.message };
  }
});

ipcMain.on('abrir-ventana-reporte', () => {
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
    // Cargas el HTML del formulario (que debes crear)
    agregarWindow.loadFile('./html/reporte.html'); // <-- Nuevo HTML
    agregarWindow.setMenu(null); 
    
    agregarWindow.once('ready-to-show', () => {
        agregarWindow.show();
    });
});