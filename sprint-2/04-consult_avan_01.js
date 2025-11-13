// Usuários e produtos têm localização geográfica (latitude/longitude)
// Os usuários podem buscar produtos por proximidade, definindo um raio de busca
// Crie índice geoespacial para otimizar essas buscas
// Buscar produtos próximos ao usuário dentro de um raio X (geospatial query)

use('Somativa');

// Função que busca produtos próximos à localização de um usuário
function getProductsByLocation(raioKm, userId) {

    // Busca o usuário pelo ID informado
    const user = db.users.findOne({ _id: ObjectId(userId) });

    // Converte o raio de quilômetros para metros (MongoDB trabalha em metros)
    const raioMetros = raioKm * 1000;

    // Busca os produtos dentro do raio especificado em relação à localização do usuário
    db.products.find({
        location: {
            $near: { // operador para consulta geoespacial
                $geometry: user.location, // usa a localização do usuário como ponto de referência
                $maxDistance: raioMetros  // define o raio máximo da busca em metros
            }
        }
    }).pretty(); // formata a exibição dos resultados
}

// Chamada da função: busca produtos até 10 km do usuário especificado
getProductsByLocation(10, '690a92fc74fa9727781cec30');

