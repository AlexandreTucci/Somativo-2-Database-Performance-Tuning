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
