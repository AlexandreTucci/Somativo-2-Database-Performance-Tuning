// Encontrar todos os produtos de uma categoria específica

use('Somativa');

// Busca o ID da categoria "Celulares" (comentado, usado apenas como exemplo)
// let categoriaEletronicos = db.categories.findOne({ name: "Celulares" });

// Consulta todos os produtos que pertencem à categoria com o ID informado
db.products.find({ 
    categoryId: ObjectId('690a92fc74fa9727781cec36') // Substitua pelo ID real da categoria
}).pretty();

