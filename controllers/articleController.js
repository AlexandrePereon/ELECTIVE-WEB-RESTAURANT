import mongoose from 'mongoose';
import Article from '../models/articleModel.js';
import Restaurant from '../models/restaurantModel.js';

const articleController = {
  // POST /article/create
  create: async (req, res) => {
    console.log(req.body.userData);
    const restaurant = await Restaurant.findOne({ createur_id: req.body.userData.id });
    const restaurantId = restaurant._id;
    console.log(restaurantId);

    // Vérifier si l'id donné est un object id
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({
        message: 'Vous n\'avez pas de restaurant',
      });
    }
    // Vérifier si le restaurant existe
    const restaurantExists = await Restaurant.findById(restaurantId);
    if (!restaurantExists) {
      return res.status(400).json({
        message: 'Restaurant not found',
      });
    }

    // Vérifier si un article avec le même nom existe déjà
    const articleExists = await Article.findOne({
      $or: [{ name: req.body.name }],
    });

    if (articleExists) {
      return res.status(400).json({
        message: 'This article already exists',
      });
    }

    // Créer un nouvel article
    const article = new Article({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      restaurant_id: restaurantId,
    });

    try {
      const createdArticle = await article.save();
      console.log("j'ai créé un article");
      return res.json({ id: createdArticle._id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },

  // GET /article/:id
  read: async (req, res) => {
    const { id } = req.params;

    try {
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      return res.json(article);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // DELETE /article/:id
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      console.log('Article deleted');
      return res.json({ message: 'Article deleted successfully' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

export default articleController;
