use('Somativa');

const buyerId = ObjectId("690c95b16892e8bfe7917bec");
const buyer = db.users.findOne({ _id: buyerId }); 
const product = db.products.findOne({ name: 'Tênis Running' });

const totalProduto = product.price;
let totalComDesconto = totalProduto - buyer.loyaltyPoints;
if (totalComDesconto < 0) totalComDesconto = 0;

const pontosGanhos = Math.floor(totalProduto * 0.05);

db.orders.insertOne({
  buyerId: buyerId,
  items: [
    { productId: product._id, price: product.price, quantity: 1 }
  ],
  status: "completed",
  date: new Date(),
  total: totalComDesconto,
  loyaltyPoints: pontosGanhos
});

// Atualiza: desconta os pontos usados + adiciona os novos
db.users.updateOne(
  { _id: buyerId },
  { $inc: { loyaltyPoints: -buyer.loyaltyPoints + pontosGanhos } }
);

print(`✅ Pedido criado! ${pontosGanhos} pontos adicionados e ${buyer.loyaltyPoints} usados.`);
