use('Somativa')

db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $lookup: {
      from: "categories",
      localField: "product.categoryId",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: "$category" },
  {
    $group: {
      _id: "$category.name",
      totalVendas: {
        $sum: { $multiply: ["$items.price", "$items.quantity"] }
      },
      totalItensVendidos: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalVendas: -1 } }
]);

