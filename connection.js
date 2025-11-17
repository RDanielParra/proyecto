import sql from "mysql2/promise"

const connection = {
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'supercampestre'
}

const _sql = sql
export { _sql as sql }
export const connectionInfo = connection