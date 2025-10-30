const $ = selector => document.querySelector(selector)
const $volver = $('#volver')


window.api.onUpdateTheme((event, theme) => {
    const root = document.documentElement
    
    root.style.setProperty('--scheme', theme)
  }
)

export const cargarEmpleados = async () => {
  if(window.api && window.api.getEmpleados) {
    try {
      console.trace('Solicitando informacion...')

      const empleados = await window.api.getEmpleados()

      console.trace('Datos recibidos: ', empleados)
    } catch (error) {
      console.error('ERROR con la obtencion de datos: ', error)
    }
  } else {
    console.error('Fallo en Electron')
  }
}


export const verificarToken = () => {
  const token = localStorage.getItem('authToken')
    if (!token) {
        window.api.sendNotification("Debe iniciar sesión para ver los productos.")
        $volver.click()
    }
    
    try {
      window.api.verificarToken(token)
      .then(response => {
      if(response){
      } else {
          window.api.sendNotification('Sesion expirada vuelve a iniciar sesion')
          $volver.click()
      }
    })
    } catch (error) {
        alert(error.message)
        $volver.click()
    }
}

export const cargarProductos = async (orden) => {
  const productos = await window.api.getProductos(orden)
  return productos
}

export const encriptarContra = async (password) => {
  const hash = await window.api.encriptarContra(password)
  return hash
}