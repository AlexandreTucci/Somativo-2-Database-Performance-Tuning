// Respostas a avaliações

use('Somativa');

// Função para que o vendedor adicione uma resposta a uma avaliação
function adicionarRespostaAvaliacao(reviewId, textoResposta) {
  try {
      // Busca a avaliação pelo ID informado
      const review = db.reviews.findOne({
        _id: ObjectId(reviewId)
      });
      
      // Busca o produto relacionado à avaliação
      const product = db.products.findOne({
        _id: review.productId
      });

      // Obtém o ID do vendedor do produto
      const sellerId = product.sellerId;

      // Atualiza o documento da avaliação, adicionando uma nova resposta
      const resultado = db.reviews.updateOne(
        { _id: ObjectId(reviewId) },
        {
          $push: { // adiciona um novo objeto no array "responses"
            responses: {
              _id: new ObjectId(),        // ID único da resposta
              sellerId: ObjectId(sellerId), // quem respondeu (vendedor)
              message: textoResposta,       // texto da resposta
              date: new Date()              // data atual
            }
          }
        }
      );

      // 🚫 Caso a avaliação não seja encontrada
      if (resultado.matchedCount === 0) {
        print("Avaliação não encontrada.");
        return false;
      }

      // ✅ Confirma sucesso
      print(`Resposta adicionada à avaliação ${reviewId}`);
      return true;

  } catch (error) {
      // ⚠️ Trata erros gerais
      print(`Erro ao adicionar resposta: ${error.message}`);
      return false;
  }
}

// 🧩 Executa a função: vendedor responde a avaliação com uma mensagem
adicionarRespostaAvaliacao('690c95b16892e8bfe7917bfc', 'Obrigado!!!');
