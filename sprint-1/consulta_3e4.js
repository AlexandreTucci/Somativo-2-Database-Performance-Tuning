use('Somativa');

async function criarPedido() {
    try {
    
        const requestedQuantity = 3;

        // Verificar produto e estoque antes
        const produto = await db.products.findOne(
            { _id: ObjectId('690a92fc74fa9727781cec3c') }
        );

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        if (produto.quantity < requestedQuantity) {
            throw new Error("estoque insuficiente");
        }

        // Dados da compra
        const novoPedido = {
            userId: ObjectId("690a928d63f91f7d9edce00c"),
            products: [
                {
                    productId: produto._id,
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ],
            total: calcular_total([
                {
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ]),
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
            { $inc: { quantity: -requestedQuantity } }
        );

        print("Pedido criado com sucesso!");
        return resultadoPedido;

    } catch (error) {
        print("Erro ao criar pedido:", error.message);
        throw error;
    }
}

// Função que calcula o total somando price * quantity para cada item
function calcular_total(items) {
    return items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
}

criarPedido();
