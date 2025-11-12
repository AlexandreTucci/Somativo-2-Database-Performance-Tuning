// Criar uma nova transação (compra)
// Atualizar quantidade de produto após uma compra

// Seleciona o banco de dados "Somativa"
use('Somativa');

// Função assíncrona para criar um novo pedido
async function criarPedido() {
    try {
        const requestedQuantity = 3; // Quantidade desejada pelo cliente

        // Busca o produto pelo ID informado
        const produto = await db.products.findOne(
            { _id: ObjectId('690a92fc74fa9727781cec3c') }
        );

        // Se o produto não existir, lança erro
        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        // Verifica se há estoque suficiente
        if (produto.quantity < requestedQuantity) {
            throw new Error("estoque insuficiente");
        }

        // Monta o objeto do novo pedido
        const novoPedido = {
            userId: ObjectId("690a928d63f91f7d9edce00c"), // ID do comprador
            products: [ // Lista de produtos comprados
                {
                    productId: produto._id,
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ],
            // Calcula o valor total (preço * quantidade)
            total: calcular_total([
                {
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ]),
            status: "pending", // Status inicial do pedido
            createdAt: new Date(), // Data de criação
            shippingAddress: { // Endereço de entrega
                street: "Rua Exemplo",
                number: "123",
                city: "Curitiba",
                state: "PR",
                zipCode: "01234-567"
            }
        };

        // Insere o pedido na coleção "orders"
        const resultadoPedido = await db.orders.insertOne(novoPedido);

        // Atualiza o estoque do produto (subtrai a quantidade comprada)
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

// Função auxiliar para calcular o total da compra
function calcular_total(items) {
    return items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
}

criarPedido();
