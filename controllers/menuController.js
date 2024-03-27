import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';

const menuController = {
  // POST /menu/create
  create: async (req, res) => {
    const { restaurant } = req;

    // Vérifier qu'il y a plusieurs articles
    if (!Array.isArray(req.body.articles) || req.body.articles.length < 2) {
      return res.status(400).json({
        message: 'A menu should have at least two articles',
      });
    }

    // Vérifier si un article avec le même nom existe déjà
    const menuExists = await Menu.findOne({
      $or: [{ name: req.body.name }],
    });

    if (menuExists) {
      return res.status(400).json({
        message: 'This menu already exists',
      });
    }

    // vérification que les articles existent et appartiennent au même restaurant
    try {
      req.body.articles.map(async (articleId) => {
        const article = await Article.findById(articleId);
        if (!article) {
          return res.status(400).json({
            message: 'Article not found',
          });
        }
        if (!article.restaurant_id.equals(restaurant.id)) {
          console.log(article.restaurant_id, restaurant.id);
          return res.status(400).json({
            message: 'All articles should belong to the same restaurant',
          });
        }
        return article;
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // Créer le nouveau menu
    const menu = new Menu({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      articles: req.body.articles,
      restaurant_id: restaurant.id,
    });

    try {
      const createdMenu = await menu.save();
      console.log('Menu créée : ', createdMenu._id);
      return res.json({ id: createdMenu._id, message: 'Menu créé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /menus/:id
  read: async (req, res) => {
    const { id } = req.params;

    try {
      const menu = await Menu.findById(id).populate('articles');
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      return res.json(menu);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  // DELETE /menu/:id
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const menu = await Menu.findByIdAndDelete(id);
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      console.log('Menu supprimé : ', menu._id);
      return res.json({ message: 'Menu deleted successfully' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { restaurant } = req;

    try {
      // Vérifier si le menu existe
      const menu = await Menu.findById(id);
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }

      if (req.body.articles) {
        if (req.body.articles.length < 2) return res.status(400).json({ message: 'Il faut minimum 2 articles dans un menu' });
        const articlePromises = req.body.articles.map(async (articleId) => {
          const article = await Article.findById(articleId);
          if (!article) {
            return res.status(400).json({ message: 'Article not found' });
          }
          if (!article.restaurant_id.equals(restaurant.id)) {
            return res.status(400).json({ message: 'All articles should belong to the same restaurant' });
          }
          return article;
        });

        // Attendre que toutes les promesses d'articles soient résolues
        const articles = await Promise.all(articlePromises);
        menu.articles = articles.map((article) => article._id);
      }

      // Mettre à jour les informations du menu
      menu.name = req.body.name || menu.name;
      menu.image = req.body.image || menu.image;
      menu.description = req.body.description || menu.description;
      menu.price = req.body.price || menu.price;

      // Enregistrer les modifications
      const updatedMenu = await menu.save();

      console.log('Menu modifié : ', updatedMenu._id);
      return res.json(updatedMenu);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

};

export default menuController;
