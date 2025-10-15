const bcrypt = require('bcrypt');

// 1. Define la contraseña que quieres hashear
const plainPassword = 'almacenista'; // <--- Cambia 'admin' por la contraseña que desees

// 2. Define el número de saltos (rounds) para el hash. 10 es el valor estándar y seguro.
const saltRounds = 10;

// Función asíncrona para generar y mostrar el hash
async function generateHash(password) {
    try {
        // Genera el hash de la contraseña de forma asíncrona
        const hash = await bcrypt.hash(password, saltRounds);

        // Muestra el hash COMPLETO en la consola
        console.log('--- HASH GENERADO ---');
        console.log(`Contraseña original: ${password}`);
        console.log(`HASH FINAL (para la BD): ${hash}`);
        console.log('-----------------------');

    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
}

// Ejecuta la función
generateHash(plainPassword);