import Restaurant from '../models/restaurantModel.js';
import Article from '../models/articleModel.js';

const restaurantController = {
  // POST /restaurant/create
  create: async (req, res) => {
    const restaurantExists = await Restaurant.findOne({
      $or: [
        { name: req.body.name },
      ],
    });

    if (restaurantExists) {
      return res.status(400).json({
        message: 'The restaurant already exists',
      });
    }

    // create new restaurant
    const restaurant = new Restaurant({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      createur_id: req.body.userData.id,
    });

    try {
      const createdRestaurant = await restaurant.save();
      return res.json({ id: createdRestaurant._id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },

  // GET /restaurant/:restaurant_id/articles
  findAll: async (req, res) => {
    const restaurantId = req.params;

    try {
      const articles = await Article.find({ restaurantId });
      if (articles.length === 0) {
        return res.status(404).json({ message: 'No articles found for the restaurant' });
      }
      return res.json(articles);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

};

export default restaurantController;
