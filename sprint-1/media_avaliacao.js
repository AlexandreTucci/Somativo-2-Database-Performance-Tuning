use('Somativa')

db.reviews.aggregate([
  {
    $group: {
      _id: "$productId",               // agrupa por produto
      avgRating: { $avg: "$rating" },  // calcula a média das avaliações
      totalReviews: { $sum: 1 }        // conta quantas avaliações o produto tem
    }
  },
  {
    $sort: { avgRating: -1 }           // opcional: ordena do melhor para o pior
  }
]);
