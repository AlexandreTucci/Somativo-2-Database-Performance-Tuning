use('Somativa');

function buscarProdutosComPromocaoAtiva() {
  const agora = new Date();

  const resultado = db.products.aggregate([
    { $match: { "promotions.inicio": { $lte: agora }, "promotions.fim": { $gte: agora } } },
    {
      $addFields: {
        precoComDesconto: {
          $round: [
            { $multiply: ["$price", { $subtract: [1, { $divide: ["$promotions.value", 100] }] }] },
            2
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        price: 1,
        precoComDesconto: 1,
        "promotions.value": 1,
        "promotions.inicio": 1,
        "promotions.fim": 1
      }
    }
  ]).toArray();

  if (resultado.length > 0) {
    print("📦 Produtos com promoções ativas:");
    printjson(resultado);
  } else {
    print("❌ Nenhuma promoção ativa encontrada.");
  }
}

// 🧹 Limpa promoções vencidas
function removerPromocoesExpiradas() {
  const result = db.products.updateMany(
    { "promotions.fim": { $lt: new Date() } },
    { $unset: { promotions: "" } }
  );
  print(`🧹 Promoções removidas: ${result.modifiedCount}`);
}

// Execução
buscarProdutosComPromocaoAtiva();
