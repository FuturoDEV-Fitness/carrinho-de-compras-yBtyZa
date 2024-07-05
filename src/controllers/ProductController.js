const Database = require('../database/connection');

class ProductController extends Database {
    constructor() {
        super();
    }

    // Cadastra um novo produto no banco de dados
    async criar(req, res) {
        try {
            const dados = req.body
            if(!dados.name || !dados.price || !dados.category_id) {
                return res.status(400).json({
                    mensagem: 'Nome, preço e categoria são obrigatórios'
                })
            }

            // Verificar se a categoria existe
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

            // Cadastra o novo produto
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

    // Listar todos os produtos
    async listar(req, res) {
        try {
            const products = await this.pool.query(
                `
                select * from products
                `
            )
            return res.status(200).json(products.rows)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message);
        }
    }

    // Listar detalhes de um produto
    async listarDetalhes(req, res) {
        try {
            const { id } = req.params

            const products = await this.pool.query(`
                select p.name, p.description, p.color, p.voltagem, p.price, c.name as category_name
                from products p
                inner join categories c on p.category_id = c.id
                where p.id = $1
                `, [id])

            if (products.rows.length === 0) {
                return res.status(404).json({
                    mensagem: 'Esse produto não existe'
                })
            }
            return res.status(200).json(products.rows[0])

        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message);
        }
    }
}

module.exports = ProductController