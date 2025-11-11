// Atualizar o esquema da coleção de products para incluir promoções temporárias
// Cada produto pode ter um campo "promocao" com as informações da promoção

// Exemplo de estrutura do campo "promocao":
// {
//   desconto: 20, // desconto em porcentagem
//   inicio: new Date("2025-11-01"), // data de início da promoção
//   fim: new Date("2025-11-30") // data de término da promoção
// }

use('Somativa');

// Adicionar uma promoção a um produto específico
db.products.updateOne(
  { _id: ObjectId("690c95b16892e8bfe7917bf6") }, // Substitua pelo ID do produto
  {
    $set: {
      promotions: {
        type: "discount",
        value: 20.0,
        inicio: new Date("2025-11-01"),
        fim: new Date("2025-11-30")
      }
    }
  }
);

// Consultar products com promoções ativas
const hoje = new Date();
db.products.find({
  "promotions.inicio": { $lte: hoje },
  "promotions.fim": { $gte: hoje }
});

// Remover uma promoção após o término
db.products.updateMany(
  { "promotions.fim": { $lt: hoje } },
  { $unset: { promotions: "" } }
);