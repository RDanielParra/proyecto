import { verificarToken } from './renderer.js'

document.getElementById("cerrarSesionBtn").addEventListener("click", () => {
  localStorage.setItem("token", null);
  verificarToken()
});
