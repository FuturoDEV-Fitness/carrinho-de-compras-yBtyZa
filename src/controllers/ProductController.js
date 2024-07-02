const Database = require('../database/connection');

class ProductController extends Database {
    constructor() {
        super();
    }

    async criar(req, res) {
        try {
            const dados = req.body
            if(!dados.name || !dados.price || !dados.category_id) {
                return res.status(400).json({
                    mensagem: 'Nome, preço e categoria são obrigatórios'
                })
            }

            const name_categoria  = req.body.category_id
            const category = await this.pool.query(
                `
                select * from categories
                where name = $1
                `, [name_categoria]
            )
            if (category.rows.length === 0) {
                return res.status(400).json({
                    mensagem: 'Essa categoria não existe'
                })
            }

            const products = await this.pool.query(
                `
                insert into products( name, amount, color, voltagem, description, price, category_id)
                values ($1, $2, $3, $4, $5, $6, $7)
                returning *
                `, [dados.name, dados.amount, dados.color, dados.voltagem, dados.description, dados.price, category.rows[0].id]
            )

            return res.status(201).json(products.rows[0])
        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({
                    mensagem: 'Esse produto ja existe'
                })
            }
            console.log(error)
            return res.status(500).json(error.message);
        }
    }

}

module.exports = ProductController