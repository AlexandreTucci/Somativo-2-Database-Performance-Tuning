// Select the database to use.
use('Somativa');

// --- 1. Users
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name","email","password","address","location"],
      properties: {
        name: {bsonType: "string"},
        email: {bsonType: "string", pattern: "^.+@.+\\..+$"},
        password: {bsonType: "string"},
        address: {bsonType: "object", properties: {
          street:{bsonType:"string"}, city:{bsonType:"string"}, zip:{bsonType:"string"}
        }},
        location: {bsonType: "object", required:["type","coordinates"],
          properties: { type: {enum:["Point"]}, coordinates: {bsonType:"array", minItems:2, maxItems:2}}
        },
        loyaltyPoints: {bsonType: "int", minimum: 0}
      }
    }
  }
});

// --- 2. Categories
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["name"],
      properties: { name:{bsonType:"string"}, parentId:{bsonType:["objectId","null"]} }
    }
  }
});

// --- 3. Products
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["name","price","quantity","sellerId","categoryId"],
      properties: {
        name:{bsonType:"string"},
        description:{bsonType:"string"},
        price:{bsonType:"double"},
        quantity:{bsonType:"int", minimum:0},
        location:{bsonType:"object", properties:{ type: {enum:["Point"]}, coordinates:{bsonType:"array"}}},
        categoryId:{bsonType:"objectId"},
        sellerId:{bsonType:"objectId"},
        promotions: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "value", "inicio", "fim"],
            properties: {
              type: { bsonType: "string" }, // Tipo de promoção (ex: "discount")
              value: { bsonType: "double" }, // Valor do desconto
              inicio: { bsonType: "date" }, // Data de início da promoção
              fim: { bsonType: "date" } // Data de término da promoção
            }
          }
        }
      }
    }
  }
});

// --- 4. Reviews
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["productId","userId","rating","comment","date"],
      properties:{
        productId:{bsonType:"objectId"},
        userId:{bsonType:"objectId"},
        rating:{bsonType:"int", minimum:1, maximum:5},
        comment:{bsonType:"string"},
        date:{bsonType:"date"},
        sellerResponse:{bsonType:["object","null"], properties:{ message:{bsonType:"string"}, date:{bsonType:"date"} }}
      }
    }
  }
});

// --- 5. Orders (transactions)
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType:"object",
      required:["buyerId","items","status","date","total"],
      properties:{
        buyerId:{bsonType:"objectId"},
        items:{
          bsonType:"array",
          minItems:1,
          items:{
            bsonType:"object",
            required:["productId","price","quantity"],
            properties:{
              productId:{bsonType:"objectId"},
              price:{bsonType:"double"},
              quantity:{bsonType:"int", minimum:1}
            }
          }
        },
        status:{bsonType:"string"},
        date:{bsonType:"date"},
        total:{bsonType:"double"},
        loyaltyPoints:{bsonType:"int"}
      }
    }
  }
});

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
