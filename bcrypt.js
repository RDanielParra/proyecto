const bcrypt = require('bcrypt');

const plainPassword = 'almacenista';


const saltRounds = 10;

async function generateHash(password) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);

        console.log('--- HASH GENERADO ---');
        console.log(`Contraseña original: ${password}`);
        console.log(`HASH FINAL (para la BD): ${hash}`);
        console.log('-----------------------');

    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
}

generateHash(plainPassword);