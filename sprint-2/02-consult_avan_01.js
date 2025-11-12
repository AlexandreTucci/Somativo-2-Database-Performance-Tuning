// Usuários e produtos têm localização geográfica (latitude/longitude)
// Os usuários podem buscar produtos por proximidade, definindo um raio de busca
// Crie índice geoespacial para otimizar essas buscas
// Buscar produtos próximos ao usuário dentro de um raio X (geospatial query)

use('Somativa');

function getProductsByLocation(raioKm, userId){
    const user = db.users.findOne({ _id: ObjectId(userId) });
    const raioMetros = raioKm * 1000;
    
    db.products.find({
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: raioMetros
        }
      }
    });
}

getProductsByLocation(10, '690c95b16892e8bfe7917bec');
