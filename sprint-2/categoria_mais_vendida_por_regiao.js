use('Somativa');

const centro = { type: "Point", coordinates: [-46.62529, -23.533773] }; // ponto central
const raio = 5000; // 5 km

db.products.aggregate([
  // 1️⃣ Primeiro: encontra produtos dentro da área desejada
  {
    $geoNear: {
      near: centro,
      distanceField: "distancia",
      spherical: true,
      key: "location", // campo que possui o índice 2dsphere
      maxDistance: raio
    }
  },

  // 2️⃣ Associa com pedidos concluídos que contenham esse produto
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "items.productId",
      as: "orders"
    }
  },
  { $unwind: "$orders" },
  { $match: { "orders.status": "completed" } },

  // 3️⃣ Junta com a categoria
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "categoria"
    }
  },
  { $unwind: "$categoria" },

  // 4️⃣ Conta vendas por categoria
  {
    $group: {
      _id: "$categoria.name",
      totalVendas: { $sum: 1 }
    }
  },

  // 5️⃣ Ordena por mais vendida
  { $sort: { totalVendas: -1 } },
  { $limit: 1 },

  // 6️⃣ Formata a saída
  {
    $project: {
      _id: 0,
      categoriaMaisVendida: "$_id",
      totalVendas: 1
    }
  }
]);
