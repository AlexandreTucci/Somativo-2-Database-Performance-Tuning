use('Somativa');

db.orders.aggregate([
  // 1️⃣ Considera apenas pedidos concluídos
  {
    $match: { status: { $in: ["completed", "entregue"] } }
  },

  // 2️⃣ "Explode" o array de itens
  { $unwind: "$items" },

  // 3️⃣ Associa o produto de cada item (para pegar o vendedor)
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "produto"
    }
  },
  { $unwind: "$produto" },

  // 4️⃣ Junta com o usuário vendedor
  {
    $lookup: {
      from: "users",
      localField: "produto.sellerId",
      foreignField: "_id",
      as: "vendedor"
    }
  },
  { $unwind: "$vendedor" },

  // 5️⃣ Agrupa os dados por vendedor
  {
    $group: {
      _id: "$vendedor._id",
      nomeVendedor: { $first: "$vendedor.name" },
      totalProdutosVendidos: { $sum: "$items.quantity" },
      receitaTotal: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },

  // 6️⃣ Ordena por maior receita
  { $sort: { receitaTotal: -1 } },

  // 7️⃣ Formata o resultado
  {
    $project: {
      _id: 0,
      nomeVendedor: 1,
      totalProdutosVendidos: 1,
      receitaTotal: { $round: ["$receitaTotal", 2] }
    }
  }
]);
