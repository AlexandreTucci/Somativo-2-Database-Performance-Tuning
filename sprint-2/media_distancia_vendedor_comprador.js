use('Somativa');
function calcularDistanciaEmKm(coord1, coord2) {
  const R = 6371; // Raio médio da Terra em km
  const [lon1, lat1] = coord1.coordinates;
  const [lon2, lat2] = coord2.coordinates;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distância em km
}

function mediaDistanciaCompradorVendedor() {
  const orders = db.orders.find({ status: "completed" }).toArray();
  let totalDistancia = 0;
  let count = 0;

  orders.forEach(order => {
    const buyer = db.users.findOne({ _id: order.buyerId });
    if (!buyer || !buyer.location) return;

    const firstItem = order.items?.[0];
    if (!firstItem) return;

    const product = db.products.findOne({ _id: firstItem.productId });
    if (!product || !product.location) return;

    const seller = db.users.findOne({ _id: product.sellerId });
    if (!seller || !seller.location) return;

    // Calcula a distância (em km)
    const distancia = calcularDistanciaEmKm(buyer.location, seller.location);
    totalDistancia += distancia;
    count++;
  });

  if (count === 0) {
    print("Nenhuma transação concluída encontrada.");
    return 0;
  }

  const media = totalDistancia / count;
  print(`Média de distância entre compradores e vendedores: ${media.toFixed(2)} km`);
  return media;
}


mediaDistanciaCompradorVendedor()