// Seleciona o banco de dados
use('Somativa');

// Primeiro, vamos pegar o ID da categoria "Eletrônicos" como exemplo
// let categoriaEletronicos = db.categories.findOne({ name: "Celulares" });

// Agora vamos buscar todos os produtos dessa categoria
db.products.find({ 
    categoryId: ObjectId('690a92fc74fa9727781cec36')
}).pretty();

// print(categoriaEletronicos._id)