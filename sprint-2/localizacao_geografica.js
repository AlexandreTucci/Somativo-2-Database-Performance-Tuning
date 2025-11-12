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
