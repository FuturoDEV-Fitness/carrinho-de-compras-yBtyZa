const Database = require('../database/connection');

class OrdersController extends Database {
    constructor() {
        super();
    }

    // Cadastra um novo pedido no banco de dados
    async criar(req, res) {
        try {
            const dados = req.body
            if (!dados.address) {
                return res.status(400).json({
                    mensagem: 'O campo address é obrigatório'
                })
            }

            // Verificar se todos os produtos possuem os campos id e amount
            for (const [index, item] of dados.products.entries()) {
                if (!item.id || !item.amount) {
                    return res.status(400).json({
                        mensagem: `O campo id e amount são obrigatórios no item ${index + 1}`
                    });
                }
            }

            // Buscar os preços dos produtos e calcular o total
            let total = 0
            const orders_items_details = []

            for (const item of dados.products) {
                const product = await this.pool.query(
                    `
                    select price from products where id = $1
                    `, [item.id]
                )

                if (product.rows.length === 0) {
                    return res.status(400).json({
                        mensagem: `Produto com id ${item.id} não encontrado`
                    })
                }

                const priceProduct = product.rows[0].price
                const amount = item.amount
                const subtotal = priceProduct * amount
                total += subtotal

                orders_items_details.push({
                    product_id: item.id,
                    amount: amount,
                    price: priceProduct
                })
                console.log(orders_items_details)
            }

            // Inserir o pedido na tabela orders
            const orders = await this.pool.query(
                `
                insert into orders (cliente_id, total, address, observations)
                values ($1, $2, $3, $4)
                returning *
                `, [dados.cliente_id, total, dados.address, dados.observations]
            )
            const order_id = orders.rows[0].id

            // Inserir os itens do pedido na tabela orders_items
            const orders_items = orders_items_details.map(async (item) => {
                return this.pool.query(
                    `
                    insert into orders_items (order_id, product_id, amount, price)
                    values ($1, $2, $3, $4)
                    returning *
                    `, [order_id, item.product_id, item.amount, item.price]
                )
            })

            await Promise.all(orders_items)
            return res.status(200).json(orders.rows)

        } catch (error) {
            if (error.code === '23503') {
                return res.status(400).json({
                    mensagem: 'Esse cliente não existe'
                })
            }
            console.log(error)
            return res.status(500).json(error.message);
        }
    }

    // Listar todos os pedidos por cliente
    async listar(req, res) {
        try {
            const {id} = req.params
            const orders = await this.pool.query(
                `
                select o.id as pedido_id, o.total, string_agg(oi.product_id::text || 'x' || oi.amount::text, ', ') as produtos
                from orders o 
                inner join orders_items oi on o.id = oi. order_id
                where o.cliente_id = $1
                group by o.id, o.total
                `, [id]
            )

            if (orders.rows.length === 0) {
                return res.status(404).json({
                    mensagem: 'Nenhum pedido encontrado'
                })
            }
            return res.status(200).json(orders.rows)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message);
        }
    }

}

module.exports = OrdersController