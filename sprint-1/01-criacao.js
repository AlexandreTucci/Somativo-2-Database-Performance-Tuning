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
