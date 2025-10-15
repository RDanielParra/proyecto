if (window.api && window.api.onNotificationMessage) {
        window.api.onNotificationMessage((event, message) => {
            console.log(message)
            const messageElement = document.getElementById('notification-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        });
    } else {
        console.error('El canal IPC de notificación no está disponible.');
}