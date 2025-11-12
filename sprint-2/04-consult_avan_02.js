// Encontrar a categoria de produto mais vendida em uma área geográfica específica

use('Somativa');

// Função auxiliar para calcular a distância entre duas coordenadas (Haversine)
function calcularDistanciaEmKm(coord1, coord2) {
  const R = 6371; // Raio médio da Terra em km

  // Extrai longitude e latitude das duas localizações
  const [lon1, lat1] = coord1.coordinates;
  const [lon2, lat2] = coord2.coordinates;

  // Converte diferenças de graus para radianos
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  // Fórmula de Haversine — calcula a distância entre dois pontos na esfera terrestre
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Retorna a distância em quilômetros
}

// Função que calcula a média de distância entre compradores e vendedores em pedidos concluídos
function mediaDistanciaCompradorVendedor() {

  // Busca todos os pedidos com status "completed"
  const orders = db.orders.find({ status: "completed" }).toArray();

  let totalDistancia = 0;
  let count = 0;

  // Percorre cada pedido
  orders.forEach(order => {
    const buyer = db.users.findOne({ _id: order.buyerId }); // comprador
    if (!buyer || !buyer.location) return;

    const firstItem = order.items?.[0]; // pega o primeiro item do pedido
    if (!firstItem) return;

    const product = db.products.findOne({ _id: firstItem.productId }); // produto do pedido
    if (!product || !product.location) return;

    const seller = db.users.findOne({ _id: product.sellerId }); // vendedor do produto
    if (!seller || !seller.location) return;

    // Calcula a distância entre comprador e vendedor
    const distancia = calcularDistanciaEmKm(buyer.location, seller.location);
    totalDistancia += distancia;
    count++;
  });

  // Caso não haja pedidos concluídos
  if (count === 0) {
    print("Nenhuma transação concluída encontrada.");
    return 0;
  }

  // Calcula e exibe a média
  const media = totalDistancia / count;
  print(`Média de distância entre compradores e vendedores: ${media.toFixed(2)} km`);
  return media;
}

mediaDistanciaCompradorVendedor();
