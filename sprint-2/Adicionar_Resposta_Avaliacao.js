function adicionarRespostaAvaliacao(reviewId, textoResposta) {
  try {
      const productId = db.reviews.findOne({
        reviewId: ObjectId(reviewId)
      });
      print(productId)
      return;
      const sellerId = db.product.findOne({
        
      });

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

adicionarRespostaAvaliacao('690c95b16892e8bfe7917bfb', 'sadsadasd');