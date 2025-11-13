// Relatórios de vendas por vendedor (incluindo quantidade vendida e receita total)

use('Somativa');

db.orders.aggregate([
  // Considera apenas pedidos concluídos
  {
    $match: { status: { $in: ["completed", "Entregue"] } }
  },

  // "Explode" o array de itens
  { $unwind: "$items" },

  // Associa o produto de cada item (para pegar o vendedor)
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "produto"
    }
  },
  { $unwind: "$produto" },

  // Junta com o usuário vendedor
  {
    $lookup: {
      from: "users",
      localField: "produto.sellerId",
      foreignField: "_id",
      as: "vendedor"
    }
  },
  { $unwind: "$vendedor" },

  // Agrupa os dados por vendedor
  {
    $group: {
      _id: "$vendedor._id",
      nomeVendedor: { $first: "$vendedor.name" },
      totalProdutosVendidos: { $sum: "$items.quantity" },
      receitaTotal: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },

  // Ordena por maior receita
  { $sort: { receitaTotal: -1 } },

  // Formata o resultado
  {
    $project: {
      _id: 0,
      nomeVendedor: 1,
      totalProdutosVendidos: 1,
      receitaTotal: { $round: ["$receitaTotal", 2] }
    }
  }
]);
