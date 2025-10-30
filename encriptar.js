const bcrypt = require('bcrypt')

const saltRounds = 10;

async function generateHash(password) {
    try {
        console.log(password)
        const hashtext = await bcrypt.hash(password, saltRounds);
        console.log(hashtext)
        return hashtext

    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
}

module.exports.generateHash = generateHash