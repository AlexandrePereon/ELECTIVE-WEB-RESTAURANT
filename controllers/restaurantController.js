import Restaurant from '../models/restaurantModel.js';
import Article from '../models/articleModel.js';
import Menu from '../models/menuModel.js';
import logger from '../utils/logger/logger.js';
import { image2WebpRestaurant } from '../utils/converter/imageConverter.js';

const restaurantController = {
  // POST /api-restaurant/create
  create: async (req, res) => {
    if (!req.body || !req.body.name) {
      return res.status(400).json({
        message: 'Informations manquantes',
      });
    }
    const restaurantExists = await Restaurant.findOne({
      $or: [
        { createur_id: req.body.userData.id },
      ],
    });

    if (restaurantExists) {
      return res.status(400).json({
        message: 'Vous avez déjà créé un restaurant',
      });
    }

    const restaurantNameExists = await Restaurant.findOne({
      $or: [
        { name: req.body.name },
      ],
    });

    if (restaurantNameExists) {
      return res.status(400).json({
        message: 'Ce nom de restaurant existe déjà',
      });
    }

    const image = await image2WebpRestaurant(req.body.image);

    // create new restaurant
    const restaurant = new Restaurant({
      name: req.body.name,
      image,
      description: req.body.description ? req.body.description : '',
      createur_id: req.body.userData.id,
    });

    try {
      const createdRestaurant = await restaurant.save();
      logger.log('info', `Restaurant créée : ${createdRestaurant._id}`);
      return res.json({ id: createdRestaurant._id, message: 'Restaurant créé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },

  // GET /api-restaurant/:restaurantId/articles/:page
  findAllArticles: async (req, res) => {
    const { page, restaurantId } = req.params || 1;
    const limit = 5;

    if (page < 1) return res.status(404).json({ message: 'Numero de page invalide' });

    const skip = (page - 1) * limit;

    try {
      const count = await Article.countDocuments({ restaurant_id: restaurantId });

      if (count === 0) {
        return res.status(404).json({ message: 'Pas d\'articles trouvés pour le restaurant' });
      }

      const articles = await Article.find({ restaurant_id: restaurantId }).limit(limit).skip(skip);
      const maxPage = Math.ceil(count / limit);

      if (page > maxPage) {
        return res.status(404).json({ message: 'Numero de page invalide' });
      }

      return res.status(200).json({ articles, maxPage, count });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /api-restaurant/:restaurantId/menus/:page
  findAllMenus: async (req, res) => {
    const { page, restaurantId } = req.params || 1;
    const limit = 5;

    if (page < 1) return res.status(404).json({ message: 'Numero de page invalide' });

    const skip = (page - 1) * limit;

    try {
      const count = await Menu.countDocuments({ restaurant_id: restaurantId });
      if (count === 0) {
        return res.status(404).json({ message: 'Pas de menus trouvés pour le restaurant' });
      }

      const menus = await Menu.find({ restaurant_id: restaurantId }).limit(limit).skip(skip);
      const maxPage = Math.ceil(count / limit);
      if (page > maxPage) {
        return res.status(404).json({ message: 'Numero de page invalide' });
      }

      return res.status(200).json({ menus, maxPage, count });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // PUT /restaurant
  update: async (req, res) => {
    try {
    // Vérifier si l'article existe
      const restaurant = await Restaurant.findOne({
        $or: [
          { createur_id: req.body.userData.id },
        ],
      });
      if (!restaurant) {
        return res.status(404).json({ message: 'Pas de restaurant trouvé' });
      }

      let { image } = req.body;
      if (image) {
        image = await image2WebpRestaurant(image);
      }

      // Mettre à jour les informations du restaurant
      restaurant.name = req.body.name || restaurant.name;
      restaurant.image = image || restaurant.image;
      restaurant.description = req.body.description || restaurant.description;

      // Enregistrer les modifications
      const updatedRestaurant = await restaurant.save();

      logger.log('info', `Restaurant modifié : ${updatedRestaurant._id}`);
      return res.json({ restaurant: updatedRestaurant, message: 'Restaurant modifié avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /api-restaurant/creator/:creator_id
  getByCreatorId: async (req, res) => {
    const userId = req.params.creator_id;

    try {
      const restaurant = await Restaurant.findOne({ createur_id: userId });
      return res.json(restaurant);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /api-restaurant/:restaurantID
  getRestaurantById: async (req, res) => {
    const { restaurantId } = req.params;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant non trouvé' });
      }
      return res.json(restaurant);
    } catch (err) {
      return res.status(400).json({ message: 'ID du restaurant invalide' });
    }
  },

  // GET /api-restaurant/all/:page
  findAllRestaurants: async (req, res) => {
    const { page } = req.params || 1;
    const limit = 5;

    if (page < 1) return res.status(404).json({ message: 'Numero de page invalide' });

    const skip = (page - 1) * limit;
    try {
      const count = await Restaurant.countDocuments({});
      if (count === 0) {
        return res.status(404).json({ message: 'Aucun restaurant trouvé' });
      }

      const restaurants = await Restaurant.find({}).limit(limit).skip(skip);
      const maxPage = Math.ceil(count / limit);
      if (page > maxPage) {
        return res.status(404).json({ message: 'Numero de page invalide' });
      }

      return res.status(200).json({ restaurants, maxPage, count });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // DELETE /restaurant
  delete: async (req, res) => {
    try {
      // Trouver le restaurant à supprimer
      const restaurant = await Restaurant.findOne({ createur_id: req.body.userData.id });

      // Vérifier si le restaurant existe
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant non trouvé' });
      }

      // Supprimer le restaurant
      await restaurant.deleteOne();

      logger.log('info', `Restaurant supprimé : ${restaurant._id}`);
      return res.json({ message: `Restaurant [${restaurant._id}] supprimé avec succès` });
    } catch (err) {
      return res.status(400).json({ message: 'ID restaurant invalide', err: err.message });
    }
  },

};

export default restaurantController;
