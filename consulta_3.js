use('Somativa');

async function criarPedido() {
    try {
        // Verificar estoque antes
        const produto = db.products.findOne(
            { name: 'Smartphone X100' }
        );
        print(produto)

        if (produto.quantity < 2) {
            throw new Error("estoque insuficiente");
        }
        if(!produto){
            throw new Error("Produto não encontrado");
        }

        // Dados da compra
        const novoPedido = {
            userId: ObjectId("690a928d63f91f7d9edce00c"),
            products: [
                {
                    productId: produto._id,
                    quantity: 2,
                    price: 99.90
                }
            ],
            total: 199.80,
            status: "pending",
            createdAt: new Date(),
            shippingAddress: {
                street: "Rua Exemplo",
                number: "123",
                city: "São Paulo",
                state: "SP",
                zipCode: "01234-567"
            }
        };

        // Inserir o pedido
        const resultadoPedido = await db.orders.insertOne(novoPedido);

        // Atualizar o estoque
        const atualizacaoEstoque = await db.products.updateOne(
            { _id: produto._id },
            { $inc: { quantity: -2 } }
        );

        print("Pedido criado com sucesso!");
        return resultadoPedido;

    } catch (error) {
        print("Erro ao criar pedido:", error.message);
        throw error;
    }
}

// Executar a função
criarPedido();