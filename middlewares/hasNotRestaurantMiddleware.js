import Restaurant from '../models/restaurantModel.js';

export default async function hasNotRestaurantMiddleware(req, res, next) {
  const { id } = req.body.userData;

  const restaurantFound = await Restaurant.findOne({ createur_id: id });
  if (!restaurantFound) {
    next();
  } else {
    res.status(400).json({
      message: 'Cet utilisateur possède déjà un restaurant.',
    });
  }
}
