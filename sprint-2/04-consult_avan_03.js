// Encontrar a categoria de produto mais vendida em uma área geográfica específica  

use('Somativa');

// Função que busca a categoria mais vendida dentro de uma determinada região
function buscarCategoriaMaisVendidaPorRegiao(raio, longitude, latitude) {

  // Define o ponto central da busca (com base na longitude e latitude informadas)
  const centro = { type: "Point", coordinates: [longitude, latitude] };

  // Agregação que encontra e analisa produtos dentro do raio especificado
  const resultado = db.products.aggregate([
    {
      // Busca geoespacial: encontra produtos próximos ao ponto central
      $geoNear: {
        near: centro,                 // ponto de referência
        distanceField: "distancia",   // campo onde será armazenada a distância calculada
        spherical: true,              // considera a curvatura da Terra
        key: "location",              // campo de localização no documento
        maxDistance: raio             // raio máximo de busca (em metros)
      }
    },
    {
      // Faz junção com a coleção de pedidos (orders)
      $lookup: {
        from: "orders",               // coleção de destino
        localField: "_id",            // ID do produto
        foreignField: "items.productId", // produtos comprados dentro de cada pedido
        as: "orders"                  // nome do campo resultante
      }
    },
    { $unwind: "$orders" },           // quebra o array de pedidos em documentos individuais
    { $match: { "orders.status": "completed" } }, // filtra apenas pedidos concluídos
    {
      // Faz junção com as categorias para identificar o nome da categoria de cada produto
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoria"
      }
    },
    { $unwind: "$categoria" },        // separa os dados de categoria
    {
      // Agrupa por categoria e soma a quantidade de vendas
      $group: {
        _id: "$categoria.name",       // nome da categoria
        totalVendas: { $sum: 1 }      // total de vendas nessa categoria
      }
    },
    { $sort: { totalVendas: -1 } },   // ordena da mais vendida para a menos vendida
    { $limit: 1 },                    // mantém apenas a categoria mais vendida
    {
      // Formata o resultado final
      $project: {
        _id: 0,
        categoriaMaisVendida: "$_id",
        totalVendas: 1
      }
    }
  ]).toArray();

  // Exibe o resultado formatado
  if (resultado.length > 0) {
    printjson(resultado[0]);
  } else {
    print("Nenhuma venda encontrada nessa região.");
  }
}

// Chama a função para buscar dentro de um raio de 5 km do ponto informado
buscarCategoriaMaisVendidaPorRegiao(5000, -46.62529, -23.533773);
