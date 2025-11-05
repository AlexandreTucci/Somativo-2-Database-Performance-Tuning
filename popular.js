// Conectar ao banco
use('Somativa');

db.products.drop();
db.categories.drop();
db.users.drop();
db.orders.drop();
db.reviews.drop();

// --- USERS ---
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

// // --- CATEGORIES ---
db.categories.insertMany([
  { name: "Eletrônicos", parentId: null },
  { name: "Celulares", parentId: null },
  { name: "Informática", parentId: null },
  { name: "Livros", parentId: null },
  { name: "Eletrodomésticos", parentId: null }
]);

// --- PRODUCTS ---
// Depois carregar as referências
const users = db.users.find().toArray();
const categories = db.categories.find().toArray();
db.products.insertMany([
  {
    name: "Smartphone X100",
    description: "Celular com câmera de 108MP e 5G",
    price: 2999.99,
    quantity: 10,
    location: { type: "Point", coordinates: [-46.63, -23.55] },
    categoryId: categories[1]._id,
    sellerId: users[1]._id,
    promotions: []
  },
  {
    name: "Notebook Ultra",
    description: "Notebook leve e rápido com SSD de 1TB",
    price: 4999.99,
    quantity: 5,
    location: { type: "Point", coordinates: [-49.27, -25.43] },
    categoryId: categories[2]._id,
    sellerId: users[0]._id,
    promotions: []
  },
  {
    name: "Livro MongoDB Essentials",
    description: "Aprenda MongoDB com exemplos práticos",
    price: 89.90,
    quantity: 20,
    location: { type: "Point", coordinates: [-43.20, -22.90] },
    categoryId: categories[3]._id,
    sellerId: users[2]._id,
    promotions: []
  },
  {
    name: "Fone Bluetooth Pro",
    description: "Fones de ouvido com cancelamento de ruído",
    price: 499.00,
    quantity: 15,
    location: { type: "Point", coordinates: [-51.23, -30.03] },
    categoryId: categories[1]._id,
    sellerId: users[3]._id,
    promotions: []
  },
  {
    name: "Geladeira FrostFree 500L", 
    description: "Eficiente e silenciosa",
    price: 3999.00,
    quantity: 3,
    location: { type: "Point", coordinates: [-47.89, -15.78] },
    categoryId: categories[4]._id,
    sellerId: users[4]._id,
    promotions: []
  }
]);

// // --- REVIEWS ---
const products = db.products.find().toArray();

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

// --- ORDERS ---
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

print("✅ Banco Somativa2DBT populado com sucesso!");

