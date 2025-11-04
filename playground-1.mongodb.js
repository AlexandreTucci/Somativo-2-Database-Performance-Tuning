// Seleciona o banco de dados
use('Somativa2DBT');

// 🔹 Exemplo 1: Buscar produtos por ID de categoria (substitua pelo ID real da categoria)
db.products.find({ 
  categoryId: ObjectId("69029195c862071f8206dc51") // coloque aqui o _id real da categoria
}).pretty();

// 🔹 Exemplo 2: Buscar produtos pela variável de categoria (caso tenha armazenado o _id antes)
let c2 = ObjectId("69029195c862071f8206dc51"); // exemplo de variável com o ID da categoria "Celulares"

db.products.find({ 
  categoryId: c2 
}).pretty();
