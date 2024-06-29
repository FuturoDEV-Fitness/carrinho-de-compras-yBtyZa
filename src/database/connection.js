const {Pool} = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'carrinho_de_compras',
            password: '1234',
            port: 5432
        });
    }
}

module.exports = Database;