const Database = require('../database/connection');

class ClientesController extends Database {
    constructor() {
        super();
    }

    async checarEmail(email) {
        try{
        const dados = await this.pool.query(
            `
            select
            *
            from
            clientes
            where
            email = $1
            `, [email]
        )
        return dados.rows.length > 0
    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message);
    }
}

    async checarCpf(cpf) {
        try{
            const dados = await this.pool.query(
                `
                select
                *
                from
                clientes
                where
                cpf = $1
                `, [cpf]
            )
            return dados.rows.length > 0
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message);
        }
    }

    async criar(req, res) {
        try {
            const dados = req.body

            if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
                return res.status(400).json({
                    mensagem: 'Todos os campos devem ser informados'
                })
            }

            const emailJaCadastrado = await this.checarEmail(dados.email)
            if (emailJaCadastrado) {
                return res.status(400).json({
                    mensagem: 'Email ja cadastrado'
                })
            }
            const cpfJaCadastrado = await this.checarCpf(dados.cpf)
            if (cpfJaCadastrado) {
                return res.status(400).json({
                    mensagem: 'CPF ja cadastrado'
                })
            }

            const cliente = await this.pool.query(
                `
                insert into clientes
                (name, email, cpf, contact)
                values
                ($1, $2, $3, $4)
                returning *
                `, [
                    dados.name,
                    dados.email,
                    dados.cpf,
                    dados.contact
                ]
            )

            return res.status(201).json({
                mensagem: cliente.rows
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message);
        }
    }
}

module.exports = ClientesController