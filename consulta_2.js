// Seleciona o banco de dados
use('Somativa2DBT');

const product = db.products.findOne({
    name: 'Smartphone X100'
})

// Busca direta por ID do produto
db.reviews.find({ 
    productId: product._id
}).pretty();
