// Calcular o total de vendas por categoria

use('Somativa');

// Calcula o total de vendas por categoria
db.orders.aggregate([
  // Separa os itens de cada pedido em documentos individuais, isso permite processar cada produto vendido separadamente
  { $unwind: "$items" },

  // Faz um "join" com a coleção de produtos. Para cada item do pedido, traz as informações completas do produto
  {
    $lookup: {
      from: "products", // coleção de origem
      localField: "items.productId", // campo no documento atual
      foreignField: "_id", // campo correspondente na coleção "products"
      as: "product" // nome do array de resultado
    }
  },

  // Desestrutura o array "product" (mantém apenas um produto por documento)
  { $unwind: "$product" },

  // Faz um novo "join", agora com a coleção de categorias, assim conseguimos relacionar o produto à sua categoria
  {
    $lookup: {
      from: "categories", // coleção de origem
      localField: "product.categoryId", // campo em "products"
      foreignField: "_id", // campo correspondente em "categories"
      as: "category" // nome do array resultante
    }
  },

  // Desestrutura o array "category"
  { $unwind: "$category" },

  // Agrupa os resultados por nome da categoria, calcula o total de vendas e o total de itens vendidos por categoria
  {
    $group: {
      _id: "$category.name", // agrupamento por nome da categoria
      totalVendas: {
        // soma de (preço × quantidade) de todos os produtos da categoria
        $sum: { $multiply: ["$items.price", "$items.quantity"] }
      },
      totalItensVendidos: {
        // soma de todas as quantidades vendidas na categoria
        $sum: "$items.quantity"
      }
    }
  },

  // Ordena as categorias pelo total de vendas (maior para menor)
  { $sort: { totalVendas: -1 } }
]);
