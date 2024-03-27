import Restaurant from '../models/restaurantModel.js';
import Article from '../models/articleModel.js';
import Menu from '../models/menuModel.js';

const restaurantController = {
  // POST /restaurant/create
  create: async (req, res) => {
    const restaurantExists = await Restaurant.findOne({
      $or: [
        { createur_id: req.body.userData.id },
      ],
    });

    if (restaurantExists) {
      return res.status(400).json({
        message: 'The user already has a restaurant',
      });
    }

    const restaurantNameExists = await Restaurant.findOne({
      $or: [
        { name: req.body.name },
      ],
    });

    if (restaurantNameExists) {
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
      console.log('Restaurant créée : ', createdRestaurant._id);
      return res.json({ id: createdRestaurant._id, message: 'Restaurant créé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },

  // GET /restaurant/:restaurant_id/articles
  findAllArticles: async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
      const articles = await Article.find({ restaurant_id: restaurantId });
      if (articles.length === 0) {
        return res.status(404).json({ message: 'No articles found for the restaurant' });
      }
      return res.json(articles);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /restaurant/:restaurant_id/menus
  findAllMenus: async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
      const menus = await Menu.find({ restaurant_id: restaurantId });
      if (menus.length === 0) {
        return res.status(404).json({ message: 'No menus found for the restaurant' });
      }
      return res.json(menus);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // PUT /restaurant/:id
  update: async (req, res) => {
    const { id } = req.params;

    try {
    // Vérifier si l'article existe
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Mettre à jour les informations du restaurant
      restaurant.name = req.body.name || restaurant.name;
      restaurant.image = req.body.image || restaurant.image;
      restaurant.description = req.body.description || restaurant.description;
      restaurant.price = req.body.price || restaurant.price;

      // Enregistrer les modifications
      const updatedRestaurant = await restaurant.save();

      console.log('Restaurant modifié : ', updatedRestaurant._id);
      return res.json(updatedRestaurant);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /restaurant/creator/:creator_id
  getByCreatorId: async (req, res) => {
    const userId = req.params.creator_id;

    try {
      const restaurant = await Restaurant.findOne({ createur_id: userId });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      return res.json(restaurant);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

export default restaurantController;
