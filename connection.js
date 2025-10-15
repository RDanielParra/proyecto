const sql = require("mysql2/promise")

const connection = {
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'supercampestre'
}

module.exports.sql = sql
module.exports.connectionInfo = connection