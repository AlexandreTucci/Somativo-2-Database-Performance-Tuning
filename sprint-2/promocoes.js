
use('Somativa');


// Adicionar pontos de fidelidade ao realizar uma compra
db.orders.insertOne({
  buyerId: ObjectId("ID_DO_USUARIO"), // Substitua pelo ID do usuário
  items: [
    { productId: ObjectId("ID_DO_PRODUTO"), price: 100, quantity: 2 }
  ],
  total: 200, // Valor total da compra
  loyaltyPointsEarned: Math.floor(200 / 10), // Exemplo: 1 ponto a cada 10 unidades monetárias
  loyaltyPointsUsed: 0, // Pontos usados nesta compra
  date: new Date(),
  status: "completed"
});

db.users.updateOne(
  { _id: ObjectId("ID_DO_USUARIO") },
  { $inc: { loyaltyPoints: Math.floor(200 / 10) } } // Incrementa os pontos do usuário
);

// Usar pontos de fidelidade como desconto em uma compra
const pontosUsados = 50; // Exemplo: o usuário quer usar 50 pontos
db.orders.insertOne({
  buyerId: ObjectId("ID_DO_USUARIO"),
  items: [
    { productId: ObjectId("ID_DO_PRODUTO"), price: 100, quantity: 2 }
  ],
  total: 200 - pontosUsados, // Aplica o desconto dos pontos
  loyaltyPointsEarned: Math.floor((200 - pontosUsados) / 10),
  loyaltyPointsUsed: pontosUsados,
  date: new Date(),
  status: "completed"
});

db.users.updateOne(
  { _id: ObjectId("ID_DO_USUARIO") },
  { $inc: { loyaltyPoints: -pontosUsados + Math.floor((200 - pontosUsados) / 10) } } // Deduz os pontos usados e adiciona os novos pontos ganhos
);