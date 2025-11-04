    /* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('Somativa2DBT');

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
        promotions:{bsonType:"array"}
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

//===================================================

// --- Users (5)
const u1 = ObjectId(); const u2 = ObjectId(); const u3 = ObjectId(); const u4 = ObjectId(); const u5 = ObjectId();
db.users.insertMany([
  {_id:u1, name:"Ana Silva", email:"ana@example.com", password:"hash1", address:{street:"R A", city:"SP", zip:"01000"}, location:{type:"Point", coordinates:[-46.6333,-23.5505]}, loyaltyPoints:120},
  {_id:u2, name:"Bruno Lima", email:"bruno@example.com", password:"hash2", address:{street:"R B", city:"SP", zip:"02000"}, location:{type:"Point", coordinates:[-46.6250,-23.5600]}, loyaltyPoints:40},
  {_id:u3, name:"Carla Souza", email:"carla@example.com", password:"hash3", address:{street:"R C", city:"RJ", zip:"20000"}, location:{type:"Point", coordinates:[-43.2075,-22.9028]}, loyaltyPoints:10},
  {_id:u4, name:"Diego Rocha", email:"diego@example.com", password:"hash4", address:{street:"R D", city:"BH", zip:"30000"}, location:{type:"Point", coordinates:[-43.9352,-19.9208]}, loyaltyPoints:0},
  {_id:u5, name:"Elisa Gomes", email:"elisa@example.com", password:"hash5", address:{street:"R E", city:"SP", zip:"03000"}, location:{type:"Point", coordinates:[-46.6200,-23.5700]}, loyaltyPoints:250}
]);

// --- Categories (5)
const c1 = ObjectId(); const c2 = ObjectId(); const c3 = ObjectId(); const c4 = ObjectId(); const c5 = ObjectId();
db.categories.insertMany([
  {_id:c1, name:"Eletrônicos", parentId: null},
  {_id:c2, name:"Celulares", parentId: c1},
  {_id:c3, name:"Roupas", parentId: null},
  {_id:c4, name:"Calçados", parentId: c3},
  {_id:c5, name:"Casa e Decoração", parentId: null}
]);

// --- Products (5)
const p1 = ObjectId(); const p2 = ObjectId(); const p3 = ObjectId(); const p4 = ObjectId(); const p5 = ObjectId();
db.products.insertMany([
  {_id:p1, name:"Smartphone X", description:"Phone top", price:1999.0, quantity:10, location:{type:"Point", coordinates:[-46.634,-23.552]}, categoryId:c2, sellerId:u2, promotions:[]},
  {_id:p2, name:"Tênis Running", description:"Confortável", price:299.9, quantity:25, location:{type:"Point", coordinates:[-46.620,-23.565]}, categoryId:c4, sellerId:u3, promotions:[{type:"discount", value:10}]},
  {_id:p3, name:"Camisa Social", description:"Algodão", price:89.9, quantity:50, location:{type:"Point", coordinates:[-43.210,-22.903]}, categoryId:c3, sellerId:u4, promotions:[]},
  {_id:p4, name:"Fone Bluetooth", description:"Cancelamento de ruído", price:399.0, quantity:5, location:{type:"Point", coordinates:[-46.630,-23.551]}, categoryId:c1, sellerId:u2, promotions:[]},
  {_id:p5, name:"Luminária Mesa", description:"LED decorativa", price:129.0, quantity:15, location:{type:"Point", coordinates:[-46.625,-23.558]}, categoryId:c5, sellerId:u5, promotions:[]}
]);

// --- Reviews (5)
db.reviews.insertMany([
  {productId:p1, userId:u1, rating:5, comment:"Ótimo aparelho", date: ISODate("2025-10-01T10:00:00Z")},
  {productId:p1, userId:u3, rating:4, comment:"Bom custo-benefício", date: ISODate("2025-10-05T12:00:00Z"), sellerResponse:{message:"Obrigado pelo feedback", date: ISODate("2025-10-06T08:00:00Z")}},
  {productId:p2, userId:u2, rating:3, comment:"Conforto médio", date: ISODate("2025-09-21T09:00:00Z")},
  {productId:p3, userId:u5, rating:4, comment:"Boa qualidade", date: ISODate("2025-08-15T11:30:00Z")},
  {productId:p4, userId:u1, rating:2, comment:"Bateria fraca", date: ISODate("2025-07-10T14:20:00Z")}
]);

// --- Orders (5)
db.orders.insertMany([
  {buyerId:u1, items:[{productId:p1, price:1999.0, quantity:1}], status:"completed", date:ISODate("2025-10-02T15:00:00Z"), total:1999.0, loyaltyPoints:20},
  {buyerId:u2, items:[{productId:p2, price:299.9, quantity:2}], status:"completed", date:ISODate("2025-09-22T13:00:00Z"), total:599.8, loyaltyPoints:6},
  {buyerId:u3, items:[{productId:p3, price:89.9, quantity:3}], status:"completed", date:ISODate("2025-08-20T10:00:00Z"), total:269.7, loyaltyPoints:2},
  {buyerId:u4, items:[{productId:p4, price:399.0, quantity:1}], status:"cancelled", date:ISODate("2025-07-12T09:00:00Z"), total:399.0, loyaltyPoints:0},
  {buyerId:u5, items:[{productId:p5, price:129.0, quantity:1}], status:"completed", date:ISODate("2025-10-10T19:00:00Z"), total:129.0, loyaltyPoints:1}
]);

//===================================================

// Products
db.products.createIndex({ categoryId: 1 }); // consulta por categoria (alta frequência)
db.products.createIndex({ sellerId: 1 }); // relatórios por vendedor
db.products.createIndex({ price: 1 }); // ordenações por preço
db.products.createIndex({ name: "text", description: "text" }); // busca por texto (nome/descrição)
db.products.createIndex({ location: "2dsphere" }); // buscas geoespaciais

// Reviews
db.reviews.createIndex({ productId: 1, rating: -1 }); // buscar avaliações de um produto ordenadas por rating
db.reviews.createIndex({ userId: 1 });

// Orders
db.orders.createIndex({ buyerId: 1, date: -1 }); // histórico por comprador
db.orders.createIndex({ "items.productId": 1 }); // consultar vendas por produto
db.orders.createIndex({ status: 1, date: -1 }); // filtrar por status e período

// Compound index example (se consultas filtram por seller + date frequentemente)
db.orders.createIndex({ "items.productId": 1, date: -1 });

//===================================================
