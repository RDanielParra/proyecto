const $ = (selector) => document.querySelector(selector)
const $btnSesion = $('#btnSesion')
const $inputUsuario = $('#usuarioInput')
const $inputContrasena = $('#contrasenaInput')
const ThrowNotification = (message) => window.api.sendNotification(message)



const handleLogin = async (e) => {
    e.preventDefault()
    const $usuarioInput = $('#usuarioInput').value
    const $contrasenaInput = $('#contrasenaInput').value
    if(!$usuarioInput || !$contrasenaInput){
        ThrowNotification('Coloque usuario y contraseña')
        return
    }

    try{
        const jwtToken = await window.api.verificarLogin($usuarioInput, $contrasenaInput)

        if(jwtToken) {
            console.log('olax2')
            localStorage.setItem('authToken', jwtToken)
            
            ThrowNotification('!Bienvenido¡ Inicio de Sesion Exitoso')

            const $goTo = $('#goTo')

            $goTo.click()

        } else {
            ThrowNotification('Usuario o Contraseña Equivocados')
        }
    } catch (error) {
        ThrowNotification('Usuario o Contraseña Equivocados')
    }
}

$btnSesion.addEventListener('click', handleLogin)
