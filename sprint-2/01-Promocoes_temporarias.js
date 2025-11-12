// Promoções temporárias, Produtos podem ter descontos ativos com data de início e fim.

use('Somativa');

// Função para buscar produtos que possuem promoções ativas no momento
function buscarProdutosComPromocaoAtiva() {
  const agora = new Date(); // Pega a data e hora atuais

  // Realiza uma agregação na coleção "products"
  const resultado = db.products.aggregate([
    { 
      // Filtra apenas os produtos com promoções dentro do intervalo atual
      $match: { 
        "promotions.inicio": { $lte: agora }, // início antes ou igual à data atual
        "promotions.fim": { $gte: agora }     // fim depois ou igual à data atual
      } 
    },
    {
      // Adiciona um novo campo calculado: preço com desconto
      $addFields: {
        precoComDesconto: {
          $round: [
            { 
              // Calcula o preço aplicando o desconto percentual
              $multiply: [
                "$price", 
                { $subtract: [1, { $divide: ["$promotions.value", 100] }] }
              ] 
            },
            2 // Arredonda o valor final para 2 casas decimais
          ]
        }
      }
    },
    {
      // Seleciona os campos que serão exibidos no resultado
      $project: {
        _id: 0, // Oculta o campo _id
        name: 1,
        price: 1,
        precoComDesconto: 1,
        "promotions.value": 1,
        "promotions.inicio": 1,
        "promotions.fim": 1
      }
    }
  ]).toArray(); // Converte o resultado do aggregate em um array

  // Exibe o resultado no console
  if (resultado.length > 0) {
    print("Produtos com promoções ativas:");
    printjson(resultado);
  } else {
    print("Nenhuma promoção ativa encontrada.");
  }
}

// Função para remover promoções que já expiraram
function removerPromocoesExpiradas() {
  // Atualiza todos os produtos cuja data de fim já passou
  const result = db.products.updateMany(
    { "promotions.fim": { $lt: new Date() } }, // Promoção expirada
    { $unset: { promotions: "" } }             // Remove o campo "promotions"
  );

  // Exibe quantos produtos foram atualizados
  print(`Promoções removidas: ${result.modifiedCount}`);
}

buscarProdutosComPromocaoAtiva();
