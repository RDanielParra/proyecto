import { hash } from 'bcrypt';

const saltRounds = 10;

async function generateHash(password) {
    try {
        console.log(password)
        const hashtext = await hash(password, saltRounds);
        console.log(hashtext)
        return hashtext

    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
}

const _generateHash = generateHash;
export { _generateHash as generateHash };