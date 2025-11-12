// 🗺️ Coordenadas centrais e raio em metros
const centro = { type: "Point", coordinates: [-46.62529, -23.533773] }; // Exemplo: São Paulo
const raio = 5000; // 5 km

db.orders.aggregate([
  // 1️⃣ Considera apenas pedidos concluídos
  { $match: { status: "concluido" } },

  // 2️⃣ Faz join com produtos
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },

  // 3️⃣ Filtra produtos dentro da área geográfica
  {
    $geoNear: {
      near: centro,
      distanceField: "distancia",
      spherical: true,
      key: "product.location",
      maxDistance: raio
    }
  },

  // 4️⃣ Junta com as categorias
  {
    $lookup: {
      from: "categories",
      localField: "product.categoryId",
      foreignField: "_id",
      as: "categoria"
    }
  },
  { $unwind: "$categoria" },

  // 5️⃣ Agrupa e conta quantos produtos de cada categoria foram vendidos
  {
    $group: {
      _id: "$categoria.name",
      totalVendas: { $sum: 1 }
    }
  },

  // 6️⃣ Ordena da categoria mais vendida para a menos vendida
  { $sort: { totalVendas: -1 } },

  // 7️⃣ Retorna só a campeã
  { $limit: 1 },

  // 8️⃣ Formata o resultado
  {
    $project: {
      _id: 0,
      categoriaMaisVendida: "$_id",
      totalVendas: 1
    }
  }
]);
