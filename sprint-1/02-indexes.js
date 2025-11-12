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
