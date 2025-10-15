const { app, BrowserWindow, ipcMain } = require('electron')
const { setMainMenu } = require('./src/Menu.js')
const path = require('path')
const { connectionInfo, sql } = require('./connection.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//const saltRounds = 10
let mainWindow
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