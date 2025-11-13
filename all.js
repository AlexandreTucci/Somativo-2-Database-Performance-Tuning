use('Somativa');

// USERS
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name","email","password","address","location"], // Campos obrigatórios
      properties: {
        name: {bsonType: "string"}, // Nome do usuário
        email: {bsonType: "string", pattern: "^.+@.+\\..+$"}, // Email válido (regex)
        password: {bsonType: "string"}, // Senha
        address: { // Endereço composto
          bsonType: "object",
          properties: {
            street:{bsonType:"string"},
            city:{bsonType:"string"},
            zip:{bsonType:"string"}
          }
        },
        location: { // Localização geográfica
          bsonType: "object",
          required:["type","coordinates"],
          properties: {
            type: {enum:["Point"]}, // Tipo de ponto geoespacial
            coordinates: {bsonType:"array", minItems:2, maxItems:2} // Latitude e longitude
          }
        },
        loyaltyPoints: {bsonType: "int", minimum: 0} // Pontos de fidelidade
      }
    }
  }
});

// CATEGORIES
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["name"], // Nome é obrigatório
      properties: {
        name:{bsonType:"string"}, // Nome da categoria
        parentId:{bsonType:["objectId","null"]} // Categoria pai (hierarquia)
      }
    }
  }
});

// PRODUCTS
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["name","price","quantity","sellerId","categoryId"], // Campos obrigatórios
      properties: {
        name:{bsonType:"string"}, // Nome do produto
        description:{bsonType:"string"}, // Descrição opcional
        price:{bsonType:"double"}, // Preço
        quantity:{bsonType:"int", minimum:0}, // Estoque
        location:{ // Localização do produto
          bsonType:"object",
          properties:{
            type: {enum:["Point"]},
            coordinates:{bsonType:"array"}
          }
        },
        categoryId:{bsonType:"objectId"}, // Relaciona com categoria
        sellerId:{bsonType:"objectId"}, // Relaciona com vendedor
        promotions: { // Lista de promoções
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "value", "inicio", "fim"], // Campos obrigatórios da promoção
            properties: {
              type: { bsonType: "string" }, // Tipo (ex: desconto)
              value: { bsonType: "double" }, // Valor do desconto
              inicio: { bsonType: "date" }, // Data inicial
              fim: { bsonType: "date" } // Data final
            }
          }
        }
      }
    }
  }
});

// REVIEWS
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["productId","userId","rating","comment","date"], // Campos obrigatórios
      properties:{
        productId:{bsonType:"objectId"}, // Produto avaliado
        userId:{bsonType:"objectId"}, // Usuário que avaliou
        rating:{bsonType:"int", minimum:1, maximum:5}, // Nota (1 a 5)
        comment:{bsonType:"string"}, // Comentário
        date:{bsonType:"date"}, // Data da avaliação
        sellerResponse:{ // Resposta opcional do vendedor
          bsonType:["object","null"],
          properties:{
            message:{bsonType:"string"},
            date:{bsonType:"date"}
          }
        }
      }
    }
  }
});

// ORDERS
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["buyerId","items","status","date","total"], // Campos obrigatórios
      properties:{
        buyerId:{bsonType:"objectId"}, // Comprador
        items:{ // Itens do pedido
          bsonType:"array",
          minItems:1,
          items:{
            bsonType:"object",
            required:["productId","price","quantity"], // Campos obrigatórios do item
            properties:{
              productId:{bsonType:"objectId"},
              price:{bsonType:"double"},
              quantity:{bsonType:"int", minimum:1}
            }
          }
        },
        status:{bsonType:"string"}, // Status do pedido (ex: “enviado”)
        date:{bsonType:"date"}, // Data da compra
        total:{bsonType:"double"}, // Valor total
        loyaltyPoints:{bsonType:"int"} // Pontos de fidelidade ganhos
      }
    }
  }
});
// ==========================================================================================================
use('Somativa');

// Products
db.products.createIndex({ categoryId: 1 }); // consulta por categoria (alta frequência)
db.products.createIndex({ sellerId: 1 }); // relatórios por vendedor
db.products.createIndex({ price: 1 }); // ordenações por preço
db.products.createIndex({ name: "text", description: "text" }); // busca por texto (nome/descrição)
db.products.createIndex({ location: "2dsphere" }); // buscas geoespaciais
db.products.createIndex({ "promotions.inicio": 1, "promotions.fim": 1 }); // índice para promoções ativas

// Reviews
db.reviews.createIndex({ productId: 1, rating: -1 }); // buscar avaliações de um produto ordenadas por rating
db.reviews.createIndex({ userId: 1 });

// Orders
db.orders.createIndex({ buyerId: 1, date: -1 }); // histórico por comprador
db.orders.createIndex({ "items.productId": 1 }); // consultar vendas por produto
db.orders.createIndex({ status: 1, date: -1 }); // filtrar por status e período

// Compound index example (se consultas filtram por seller + date frequentemente)
db.orders.createIndex({ "items.productId": 1, date: -1 });
// ==========================================================================================================
// Seleciona o banco de dados "Somativa"
use('Somativa');

// Remove coleções antigas (se existirem)
db.products.drop();
db.categories.drop();
db.users.drop();
db.orders.drop();
db.reviews.drop();

// USERS
// Insere usuários com informações pessoais, endereço, localização e pontos de fidelidade
db.users.insertMany([
  {
    name: "Alice Santos",
    email: "alice@example.com",
    password: "123456",
    address: { street: "Rua A", city: "Curitiba", zip: "80000-000" },
    location: { type: "Point", coordinates: [-49.27, -25.43] },
    loyaltyPoints: 150
  },
  {
    name: "Bruno Oliveira",
    email: "bruno@example.com",
    password: "abc123",
    address: { street: "Av. Brasil", city: "São Paulo", zip: "01000-000" },
    location: { type: "Point", coordinates: [-46.63, -23.55] },
    loyaltyPoints: 80
  },
  {
    name: "Carla Lima",
    email: "carla@example.com",
    password: "pass123",
    address: { street: "Rua das Flores", city: "Rio de Janeiro", zip: "20000-000" },
    location: { type: "Point", coordinates: [-43.20, -22.90] },
    loyaltyPoints: 230
  },
  {
    name: "Diego Rocha",
    email: "diego@example.com",
    password: "senha123",
    address: { street: "Rua Central", city: "Porto Alegre", zip: "90000-000" },
    location: { type: "Point", coordinates: [-51.23, -30.03] },
    loyaltyPoints: 100
  },
  {
    name: "Elisa Mendes",
    email: "elisa@example.com",
    password: "qwerty",
    address: { street: "Av. das Nações", city: "Brasília", zip: "70000-000" },
    location: { type: "Point", coordinates: [-47.89, -15.78] },
    loyaltyPoints: 300
  }
]);

// CATEGORIES
// Insere categorias principais sem hierarquia (parentId = null)
db.categories.insertMany([
  { name: "Eletrônicos", parentId: null },
  { name: "Celulares", parentId: null },
  { name: "Informática", parentId: null },
  { name: "Livros", parentId: null },
  { name: "Eletrodomésticos", parentId: null }
]);

// PRODUCTS
// Busca usuários e categorias para usar os _id nas referências
const users = db.users.find().toArray();
const categories = db.categories.find().toArray();

// Insere produtos, relacionando categoria e vendedor
db.products.insertMany([
  {
    name: "Smartphone X100",
    description: "Celular com câmera de 108MP e 5G",
    price: 2999.99,
    quantity: 10,
    location: { type: "Point", coordinates: [-46.63, -23.55] },
    categoryId: categories[1]._id, // Celulares
    sellerId: users[1]._id, // Bruno
    promotions: []
  },
  {
    name: "Notebook Ultra",
    description: "Notebook leve e rápido com SSD de 1TB",
    price: 4999.99,
    quantity: 5,
    location: { type: "Point", coordinates: [-49.27, -25.43] },
    categoryId: categories[2]._id, // Informática
    sellerId: users[0]._id, // Alice
    promotions: []
  },
  {
    name: "Livro MongoDB Essentials",
    description: "Aprenda MongoDB com exemplos práticos",
    price: 89.90,
    quantity: 20,
    location: { type: "Point", coordinates: [-43.20, -22.90] },
    categoryId: categories[3]._id, // Livros
    sellerId: users[2]._id, // Carla
    promotions: []
  },
  {
    name: "Fone Bluetooth Pro",
    description: "Fones de ouvido com cancelamento de ruído",
    price: 499.00,
    quantity: 15,
    location: { type: "Point", coordinates: [-51.23, -30.03] },
    categoryId: categories[1]._id, // Celulares
    sellerId: users[3]._id, // Diego
    promotions: []
  },
  {
    name: "Geladeira FrostFree 500L", 
    description: "Eficiente e silenciosa",
    price: 3999.00,
    quantity: 3,
    location: { type: "Point", coordinates: [-47.89, -15.78] },
    categoryId: categories[4]._id, // Eletrodomésticos
    sellerId: users[4]._id, // Elisa
    promotions: []
  }
]);

// REVIEWS
// Busca produtos para referenciar nos reviews
const products = db.products.find().toArray();

// Insere avaliações com notas, comentários e respostas do vendedor
db.reviews.insertMany([
  {
    productId: products[0]._id,
    userId: users[2]._id,
    rating: 5,
    comment: "Excelente smartphone!",
    date: new Date(),
    sellerResponse: { message: "Obrigado pela avaliação!", date: new Date() }
  },
  {
    productId: products[1]._id,
    userId: users[3]._id,
    rating: 4,
    comment: "Muito rápido, mas esquenta um pouco.",
    date: new Date(),
    sellerResponse: null
  },
  {
    productId: products[2]._id,
    userId: users[0]._id,
    rating: 5,
    comment: "Livro ótimo para quem está começando!",
    date: new Date(),
    sellerResponse: null
  },
  {
    productId: products[3]._id,
    userId: users[4]._id,
    rating: 3,
    comment: "Bom som, mas a bateria dura pouco.",
    date: new Date(),
    sellerResponse: { message: "Vamos melhorar!", date: new Date() }
  },
  {
    productId: products[4]._id,
    userId: users[1]._id,
    rating: 4,
    comment: "Ótima geladeira!",
    date: new Date(),
    sellerResponse: null
  }
]);

// ORDERS
// Insere pedidos com comprador, itens, status, total e pontos de fidelidade
db.orders.insertMany([
  {
    buyerId: users[0]._id,
    items: [
      { productId: products[0]._id, price: 2999.99, quantity: 1 },
      { productId: products[3]._id, price: 499.00, quantity: 1 }
    ],
    status: "Enviado",
    date: new Date(),
    total: 3498.99,
    loyaltyPoints: 35
  },
  {
    buyerId: users[1]._id,
    items: [
      { productId: products[2]._id, price: 89.90, quantity: 2 }
    ],
    status: "Entregue",
    date: new Date(),
    total: 179.80,
    loyaltyPoints: 10
  },
  {
    buyerId: users[2]._id,
    items: [
      { productId: products[1]._id, price: 4999.99, quantity: 1 }
    ],
    status: "Processando",
    date: new Date(),
    total: 4999.99,
    loyaltyPoints: 50
  },
  {
    buyerId: users[3]._id,
    items: [
      { productId: products[4]._id, price: 3999.00, quantity: 1 }
    ],
    status: "Entregue",
    date: new Date(),
    total: 3999.00,
    loyaltyPoints: 40
  },
  {
    buyerId: users[4]._id,
    items: [
      { productId: products[0]._id, price: 2999.99, quantity: 2 }
    ],
    status: "Cancelado",
    date: new Date(),
    total: 5999.98,
    loyaltyPoints: 0
  }
]);

print("Banco Somativa2DBT populado com sucesso!");
// ==========================================================================================================
// Encontrar todos os produtos de uma categoria específica

use('Somativa');

// Busca o ID da categoria "Celulares" (comentado, usado apenas como exemplo)
// let categoriaEletronicos = db.categories.findOne({ name: "Celulares" });

// Consulta todos os produtos que pertencem à categoria com o ID informado
db.products.find({ 
    categoryId: ObjectId('690a92fc74fa9727781cec36') // Substitua pelo ID real da categoria
}).pretty();
// ==========================================================================================================
// Buscar todas as avaliações de um produto

use('Somativa');

// Busca um produto específico pelo nome
const product = db.products.findOne({
    name: 'Smartphone X100'
});

// Busca todas as avaliações (reviews) relacionadas a esse produto
db.reviews.find({ 
    productId: product._id // Filtra pelo ID do produto encontrado
}).pretty();
// ==========================================================================================================
// Criar uma nova transação (compra)
// Atualizar quantidade de produto após uma compra

// Seleciona o banco de dados "Somativa"
use('Somativa');

// Função assíncrona para criar um novo pedido
async function criarPedido() {
    try {
        const requestedQuantity = 3; // Quantidade desejada pelo cliente

        // Busca o produto pelo ID informado
        const produto = await db.products.findOne(
            { _id: ObjectId('690a92fc74fa9727781cec3c') }
        );

        // Se o produto não existir, lança erro
        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        // Verifica se há estoque suficiente
        if (produto.quantity < requestedQuantity) {
            throw new Error("estoque insuficiente");
        }

        // Monta o objeto do novo pedido
        const novoPedido = {
            userId: ObjectId("690a928d63f91f7d9edce00c"), // ID do comprador
            products: [ // Lista de produtos comprados
                {
                    productId: produto._id,
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ],
            // Calcula o valor total (preço * quantidade)
            total: calcular_total([
                {
                    quantity: requestedQuantity,
                    price: produto.price
                }
            ]),
            status: "pending", // Status inicial do pedido
            createdAt: new Date(), // Data de criação
            shippingAddress: { // Endereço de entrega
                street: "Rua Exemplo",
                number: "123",
                city: "Curitiba",
                state: "PR",
                zipCode: "01234-567"
            }
        };

        // Insere o pedido na coleção "orders"
        const resultadoPedido = await db.orders.insertOne(novoPedido);

        // Atualiza o estoque do produto (subtrai a quantidade comprada)
        const atualizacaoEstoque = await db.products.updateOne(
            { _id: produto._id },
            { $inc: { quantity: -requestedQuantity } }
        );

        print("Pedido criado com sucesso!");
        return resultadoPedido;

    } catch (error) {
        print("Erro ao criar pedido:", error.message);
        throw error;
    }
}

// Função auxiliar para calcular o total da compra
function calcular_total(items) {
    return items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
}

criarPedido();
// ==========================================================================================================
// Calcular a média de avaliação por produto

use('Somativa')

db.reviews.aggregate([
  {
    $group: {
      _id: "$productId", // agrupa por produto
      avgRating: { $avg: "$rating" }, // calcula a média das avaliações
      totalReviews: { $sum: 1 } // conta quantas avaliações o produto tem
    }
  },
  {
    $sort: { avgRating: -1 } // ordena do melhor para o pior
  }
]);
// ==========================================================================================================
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
// ==========================================================================================================
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
// ==========================================================================================================
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
// ==========================================================================================================
// Respostas a avaliações

use('Somativa');

// Função para que o vendedor adicione uma resposta a uma avaliação
function adicionarRespostaAvaliacao(reviewId, textoResposta) {
  try {
      // Busca a avaliação pelo ID informado
      const review = db.reviews.findOne({
        _id: ObjectId(reviewId)
      });
      
      // Busca o produto relacionado à avaliação
      const product = db.products.findOne({
        _id: review.productId
      });

      // Obtém o ID do vendedor do produto
      const sellerId = product.sellerId;

      // Atualiza o documento da avaliação, adicionando uma nova resposta
      const resultado = db.reviews.updateOne(
        { _id: ObjectId(reviewId) },
        {
          $push: { // adiciona um novo objeto no array "responses"
            responses: {
              _id: new ObjectId(),        // ID único da resposta
              sellerId: ObjectId(sellerId), // quem respondeu (vendedor)
              message: textoResposta,       // texto da resposta
              date: new Date()              // data atual
            }
          }
        }
      );

      // Caso a avaliação não seja encontrada
      if (resultado.matchedCount === 0) {
        print("Avaliação não encontrada.");
        return false;
      }

      // Confirma sucesso
      print(`Resposta adicionada à avaliação ${reviewId}`);
      return true;

  } catch (error) {
      // Trata erros gerais
      print(`Erro ao adicionar resposta: ${error.message}`);
      return false;
  }
}

// Executa a função: vendedor responde a avaliação com uma mensagem
adicionarRespostaAvaliacao('690c95b16892e8bfe7917bfc', 'Obrigado!!!');
// ==========================================================================================================
// Sistema de pontos de fidelidade

use('Somativa');

// ID do comprador
const buyerId = ObjectId("690a92fc74fa9727781cec30");

// Busca o comprador no banco
const buyer = db.users.findOne({ _id: buyerId }); 

// Busca o produto que será comprado
const product = db.products.findOne({ name: 'Smartphone X100' });

// Calcula o valor total do produto
const totalProduto = product.price;

// Aplica os pontos de fidelidade do comprador como desconto
let totalComDesconto = totalProduto - buyer.loyaltyPoints;

// ita que o valor total fique negativo
if (totalComDesconto < 0) totalComDesconto = 0;

// Calcula os pontos de fidelidade ganhos (5% do valor do produto)
const pontosGanhos = Math.floor(totalProduto * 0.05);

// Cria um novo pedido na coleção "orders"
db.orders.insertOne({
  buyerId: buyerId, // comprador
  items: [
    { productId: product._id, price: product.price, quantity: 1 } // item comprado
  ],
  status: "completed", // pedido finalizado
  date: new Date(), // data atual
  total: totalComDesconto, // valor após desconto
  loyaltyPoints: pontosGanhos // pontos ganhos nesta compra
});

// Atualiza os pontos do usuário:
// remove os pontos usados e adiciona os novos pontos ganhos
db.users.updateOne(
  { _id: buyerId },
  { $inc: { loyaltyPoints: -buyer.loyaltyPoints + pontosGanhos } }
);

print(`Pedido criado! ${pontosGanhos} pontos adicionados e ${buyer.loyaltyPoints} usados.`);
// ==========================================================================================================
// Usuários e produtos têm localização geográfica (latitude/longitude)
// Os usuários podem buscar produtos por proximidade, definindo um raio de busca
// Crie índice geoespacial para otimizar essas buscas
// Buscar produtos próximos ao usuário dentro de um raio X (geospatial query)

use('Somativa');

// Função que busca produtos próximos à localização de um usuário
function getProductsByLocation(raioKm, userId) {

    // Busca o usuário pelo ID informado
    const user = db.users.findOne({ _id: ObjectId(userId) });

    // Converte o raio de quilômetros para metros (MongoDB trabalha em metros)
    const raioMetros = raioKm * 1000;

    // Busca os produtos dentro do raio especificado em relação à localização do usuário
    db.products.find({
        location: {
            $near: { // operador para consulta geoespacial
                $geometry: user.location, // usa a localização do usuário como ponto de referência
                $maxDistance: raioMetros  // define o raio máximo da busca em metros
            }
        }
    }).pretty(); // formata a exibição dos resultados
}

// Chamada da função: busca produtos até 10 km do usuário especificado
getProductsByLocation(10, '690a92fc74fa9727781cec30');

// ==========================================================================================================
// Encontrar a categoria de produto mais vendida em uma área geográfica específica

use('Somativa');

// Função auxiliar para calcular a distância entre duas coordenadas (Haversine)
function calcularDistanciaEmKm(coord1, coord2) {
  const R = 6371; // Raio médio da Terra em km

  // Extrai longitude e latitude das duas localizações
  const [lon1, lat1] = coord1.coordinates;
  const [lon2, lat2] = coord2.coordinates;

  // Converte diferenças de graus para radianos
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  // Fórmula de Haversine — calcula a distância entre dois pontos na esfera terrestre
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Retorna a distância em quilômetros
}

// Função que calcula a média de distância entre compradores e vendedores em pedidos concluídos
function mediaDistanciaCompradorVendedor() {

  // Busca todos os pedidos com status "completed"
  const orders = db.orders.find({ status: "completed" }).toArray();

  let totalDistancia = 0;
  let count = 0;

  // Percorre cada pedido
  orders.forEach(order => {
    const buyer = db.users.findOne({ _id: order.buyerId }); // comprador
    if (!buyer || !buyer.location) return;

    const firstItem = order.items?.[0]; // pega o primeiro item do pedido
    if (!firstItem) return;

    const product = db.products.findOne({ _id: firstItem.productId }); // produto do pedido
    if (!product || !product.location) return;

    const seller = db.users.findOne({ _id: product.sellerId }); // vendedor do produto
    if (!seller || !seller.location) return;

    // Calcula a distância entre comprador e vendedor
    const distancia = calcularDistanciaEmKm(buyer.location, seller.location);
    totalDistancia += distancia;
    count++;
  });

  // Caso não haja pedidos concluídos
  if (count === 0) {
    print("Nenhuma transação concluída encontrada.");
    return 0;
  }

  // Calcula e exibe a média
  const media = totalDistancia / count;
  print(`Média de distância entre compradores e vendedores: ${media.toFixed(2)} km`);
  return media;
}

mediaDistanciaCompradorVendedor();
// ==========================================================================================================
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
