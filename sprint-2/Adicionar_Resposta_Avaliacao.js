
use('Somativa');

function adicionarRespostaAvaliacao(reviewId, textoResposta) {
  try {
      const review = db.reviews.findOne({
        _id: ObjectId(reviewId)
      });
      
      const product = db.products.findOne({
        _id: review.productId
      });

      const sellerId = product.sellerId

    const resultado = db.reviews.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $push: {
          responses: {
            _id: new ObjectId(),
            sellerId: ObjectId(sellerId),
            message: textoResposta,
            date: new Date()
          }
        }
      }
    );

    if (resultado.matchedCount === 0) {
      print("❌ Avaliação não encontrada.");
      return false;
    }

    print(`✅ Resposta adicionada à avaliação ${reviewId}`);
    return true;
  } catch (error) {
    print(`❌ Erro ao adicionar resposta: ${error.message}`);
    return false;
  }
}

adicionarRespostaAvaliacao('690c95b16892e8bfe7917bfc', 'Obrigado!!!');