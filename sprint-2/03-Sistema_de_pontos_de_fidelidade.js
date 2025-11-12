// Sistema de pontos de fidelidade

use('Somativa');

// ID do comprador
const buyerId = ObjectId("690c95b16892e8bfe7917bec");

// Busca o comprador no banco
const buyer = db.users.findOne({ _id: buyerId }); 

// Busca o produto que será comprado
const product = db.products.findOne({ name: 'Tênis Running' });

// Calcula o valor total do produto
const totalProduto = product.price;

// Aplica os pontos de fidelidade do comprador como desconto
let totalComDesconto = totalProduto - buyer.loyaltyPoints;

// ita que o valor total fique negativo
if (totalComDesconto < 0) totalComDesconto = 0;

// Calcula os pontos de fidelidade ganhos (5% do valor do produto)
const pontosGanhos = Math.floor(totalProduto * 0.05);

// Cria um novo pedido na coleção "orders"
db.orders.insertOne({
  buyerId: buyerId, // comprador
  items: [
    { productId: product._id, price: product.price, quantity: 1 } // item comprado
  ],
  status: "completed", // pedido finalizado
  date: new Date(), // data atual
  total: totalComDesconto, // valor após desconto
  loyaltyPoints: pontosGanhos // pontos ganhos nesta compra
});

// Atualiza os pontos do usuário:
// remove os pontos usados e adiciona os novos pontos ganhos
db.users.updateOne(
  { _id: buyerId },
  { $inc: { loyaltyPoints: -buyer.loyaltyPoints + pontosGanhos } }
);

print(`Pedido criado! ${pontosGanhos} pontos adicionados e ${buyer.loyaltyPoints} usados.`);
