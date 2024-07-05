# API RESTful

## Descrição

Esta API é projetada para gerenciar usuários, produtos e pedidos. Permite criar usuários e produtos, listar produtos, obter detalhes de produtos, criar pedidos e listar pedidos de um cliente específico.

## Endpoints

### Usuários

#### POST /clientes

Cria um novo usuário.

**Parâmetros:**

- `name`: Nome do usuário.
- `email`: Email do usuário.
- `cpf`: CPF do usuário.
- `contact`: Contato do usuário.

**Exemplo de Requisição:**

```json
{
    "name": "Usuario",
    "email": "usuario@email.com",
    "cpf": "00000000001",
    "contact": "48999999999"
}
```

### Produtos

#### POST /products

Cadastra um novo produto.

**Parâmetros:**

- `name`: Nome do produto.
- `amount`: Quantidade do produto.
- `color`: Cor do produto.
- `voltagem`: Voltagem do produto.
- `description`: Descrição do produto.
- `price`: Preço do produto.
- `category_id`: ID da categoria do produto.

**Exemplo de Requisição:**

```json
{
    "name": "Produto A",
    "amount": "10",
    "color": "Preto",
    "voltagem": "127",
    "description": "Descrição do produto A",
    "price": 10,
    "category_id": "categoria_a"
}
```
#### GET /products

Lista todos os produtos.

**Exemplo de Resposta:**

```json
[
    {
        "id": 28,
        "name": "Produto A",
        "description": "Descrição do produto A",
        "color": "Preto",
        "voltagem": "220",
        "price": 100,
        "category_name": "categoria_a"
    },
    {
        "id": 29,
        "name": "Produto B",
        "description": "Descrição do produto B",
        "color": "Branco",
        "voltagem": "110",
        "price": 200,
        "category_name": "categoria_b"
    }
]

```

#### GET /products/:id

Obtém os detalhes de um produto específico.

**Parâmetros:**

- `product_id`: ID do produto.

- **Exemplo de Resposta:**

```json
{
    "name": "MSI B450 TOMAHAWK MAX",
    "description": "Placa mãe com suporte a processadores AMD Ryzen e recursos avançados para jogos",
    "color": "Preto",
    "voltagem": "220",
    "price": 900,
    "category_name": "placa_mae"
}

```

### Pedidos

#### POST /orders

Cria um novo pedido.

**Parâmetros:**

- `cliente_id`: ID do cliente.
- `address`: Endereço de entrega.
- `observations`: Observações sobre o pedido.
- `products`: Lista de produtos com ID e quantidade.

**Exemplo de Requisição:**

```json
{
    "cliente_id": 1,
    "address": "Rua tal",
    "observations": "Entregar na rua tal",
    "products": [
        {"id": 28, "amount": 2},
        {"id": 29, "amount": 1},
        {"id": 29, "amount": 3},
        {"id": 50, "amount": 1}
    ]
}
```

#### GET /orders/:id

Lista todos os pedidos de um cliente específico.

**Parâmetros:**

- `client_id`: ID do cliente.

**Exemplo de Resposta:**

```json
[
    {
        "pedido_id": 32,
        "total": "8200.00",
        "produtos": "28x2, 29x1, 50x1, 29x3"
    },
    {
        "pedido_id": 30,
        "total": "8200.00",
        "produtos": "28x2, 29x3, 50x1, 29x1"
    }
]
```

## Instalação

### Clone o repositório:

```sh
git clone https://github.com/FuturoDEV-Fitness/carrinho-de-compras-yBtyZa.git
```

### Navegue até o diretório do projeto

```sh
cd carrinho-de-compras-yBtyZa
```

### Instale as dependências

```sh
npm install
```

### Variáveis de ambiente

Esse projeto não esta trabalhando com arquivo `.env`, acesse o arquivo `src/database/connection.js`, e configure seu banco dados Postgres.


### Inicie o servidor

```sh
npm start
```

## Estrutura do Banco de Dados

### Tabelas Criadas

#### Tabela `clientes`

```sql
-- Criando tabela clientes
create table clientes (
    id serial primary key,
    name varchar(150) not null,
    email varchar(150) unique not null,
    cpf varchar(50) unique not null,
    contact varchar(20) not null
);
```
#### Tabela `categories`

```sql
-- Criando tabela categories
create table categories (
    id serial primary key,
    name varchar(150) not null
);

-- Populando a tabela categories
INSERT INTO categories (name)
VALUES
('placa_mae'),
('processadores'),
('memoria_ram'),
('placa_de_video'),
('ssd'),
('mouse'),
('teclado'),
('monitores'),
('gabinete'),
('fonte_de_alimentacao');
```
#### Tabela `products`

```sql
-- Criando um conjunto de valores para a coluna voltagem
create type voltagem as enum('110', '127', '220');

-- Criando a tabela produtos
create table products(
    id serial primary key,
    name varchar(150) not null unique,
    amount varchar(150) default '0',
    color varchar(50),
    voltagem voltagem,
    description text,
    price int not null,
    category_id int not null,
    foreign key (category_id) references categories(id)
);
```

#### Tabela `orders`

```sql
-- Criando tabela orders
create table orders (
    id serial primary key,
    cliente_id int not null,
    total decimal(10, 2) not null,
    address text not null,
    observations varchar(150),
    foreign key (cliente_id) references clientes(id)
);
```

#### Tabela `orders_items`

```sql
-- Criando tabela orders_items
create table orders_items (
    id serial primary key,
    order_id int not null,
    product_id int not null,
    amount varchar(150) default '0',
    price int not null,
    foreign key (product_id) references products(id),
    foreign key (order_id) references orders(id)
);
```

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- Node.js
- Express
- PostgreSQL
