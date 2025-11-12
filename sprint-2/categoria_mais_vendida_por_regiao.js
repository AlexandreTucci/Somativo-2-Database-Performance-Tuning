use('Somativa');

function buscarCategoriaMaisVendidaPorRegiao(raio, longitude, latitude){
  const centro = { type: "Point", coordinates: [longitude, latitude] }; // ponto central
  
  const resultado = db.products.aggregate([
    {
      $geoNear: {
        near: centro,
        distanceField: "distancia",
        spherical: true,
        key: "location",
        maxDistance: raio
      }
    },
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
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoria"
      }
    },
    { $unwind: "$categoria" },
    {
      $group: {
        _id: "$categoria.name",
        totalVendas: { $sum: 1 }
      }
    },
    { $sort: { totalVendas: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        categoriaMaisVendida: "$_id",
        totalVendas: 1
      }
    }
  ]).toArray();

  // Retorna o resultado formatado
  if (resultado.length > 0) {
    printjson(resultado[0]);
  } else {
    print("Nenhuma venda encontrada nessa região.");
  }
}

buscarCategoriaMaisVendidaPorRegiao(5000, -46.62529, -23.533773);
