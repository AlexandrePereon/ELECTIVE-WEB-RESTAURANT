import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';
import logger from '../utils/logger/logger.js';
import { image2WebpProduits } from '../utils/converter/imageConverter.js';

const menuController = {
  // POST /menu/create
  create: async (req, res) => {
    const { restaurant } = req;

    // Vérifier qu'il y a plusieurs articles
    if (!Array.isArray(req.body.articles) || req.body.articles.length < 2) {
      return res.status(400).json({
        message: 'Un menu doit au moins contenir 2 articles',
      });
    }

    // Vérifier si un menu avec le même nom existe déjà
    const menuExists = await Menu.findOne({
      name: req.body.name,
      restaurant_id: restaurant.id,
    });

    if (menuExists) {
      return res.status(400).json({
        message: 'Ce menu existe déjà',
      });
    }

    // vérification que les articles existent et appartiennent au même restaurant
    try {
      req.body.articles.map(async (articleId) => {
        const article = await Article.findById(articleId);
        if (!article) {
          return res.status(400).json({
            message: 'Article non trouvé',
          });
        }
        if (!article.restaurant_id.equals(restaurant.id)) {
          console.log(article.restaurant_id, restaurant.id);
          return res.status(400).json({
            message: 'Tous les articles doivent appartient au même restaurant',
          });
        }
        return article;
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    let { image } = req.body;
    if (image) {
      image = await image2WebpProduits(image);
    }

    // Créer le nouveau menu
    const menu = new Menu({
      name: req.body.name,
      image,
      description: req.body.description,
      price: req.body.price,
      articles: req.body.articles,
      restaurant_id: restaurant.id,
    });

    try {
      const createdMenu = await menu.save();
      logger.log('info', `Menu créé avec succès : ${createdMenu._id}`);
      return res.json({ id: createdMenu._id, message: 'Menu créé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /menus/:menuId
  read: async (req, res) => {
    const { menuId } = req.params;

    try {
      const menu = await Menu.findById(menuId).populate('articles');
      if (!menu) {
        return res.status(404).json({ message: 'Menu non trouvé' });
      }
      return res.json(menu);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  // DELETE /menu/:menuId
  delete: async (req, res) => {
    const { menuId } = req.params;
    try {
      const menu = await Menu.findByIdAndDelete(menuId);
      if (!menu) {
        return res.status(404).json({ message: 'Menu non trouvé' });
      }
      logger.log('info', `Menu supprimé : ${menu._id}`);
      return res.json({ message: 'Menu supprimé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    const { menuId } = req.params;
    const { restaurant } = req;

    try {
      // Vérifier si le menu existe
      const menu = await Menu.findById(menuId);
      if (!menu) {
        return res.status(404).json({ message: 'Menu non trouvé' });
      }

      if (req.body.articles) {
        if (req.body.articles.length < 2) return res.status(400).json({ message: 'Il faut minimum 2 articles dans un menu' });
        const articlePromises = req.body.articles.map(async (articleId) => {
          const article = await Article.findById(articleId);
          if (!article) {
            return res.status(400).json({ message: 'Article non trouvé' });
          }
          if (!article.restaurant_id.equals(restaurant.id)) {
            return res.status(400).json({ message: 'Tous les articles doivent appartenir au même restaurant' });
          }
          return article;
        });

        // Attendre que toutes les promesses d'articles soient résolues
        const articles = await Promise.all(articlePromises);
        menu.articles = articles.map((article) => article._id);
      }

      let { image } = req.body;
      if (image) {
        image = await image2WebpProduits(image);
      }

      const { name } = req.body;
      if (name) {
        const existingName = await Menu.findOne({
          name,
          restaurant_id: restaurant.id,
          _id: { $ne: menuId }, // Exclure le menu actuel
        });

        if (existingName) {
          return res.status(404).json({ message: 'Nom déjà présent dans les menus' });
        }
      }

      // Mettre à jour les informations du menu
      menu.name = req.body.name || menu.name;
      menu.image = image || menu.image;
      menu.description = req.body.description || menu.description;
      menu.price = req.body.price || menu.price;

      // Enregistrer les modifications
      const updatedMenu = await menu.save();

      logger.log('info', `Menu modifié : ${updatedMenu._id}`);
      return res.json(updatedMenu);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

};

export default menuController;
