// Seleciona o banco de dados
use('Somativa2DBT');

// Primeiro, vamos pegar o ID da categoria "Eletrônicos" como exemplo
let categoriaEletronicos = db.categories.findOne({ name: "Celulares" });

// Agora vamos buscar todos os produtos dessa categoria
db.products.find({ 
    categoryId: categoriaEletronicos._id 
}).pretty();

