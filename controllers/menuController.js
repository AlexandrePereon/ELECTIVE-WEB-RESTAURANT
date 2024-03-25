import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';
import Restaurant from '../models/restaurantModel.js';

const menuController = {
  // POST /menu/create
  create: async (req, res) => {
    // Trouver l'id du restaurant qui appartient à req.body.userData
    const restaurant = await Restaurant.findOne({ createur_id: req.body.userData.id });
    const restaurantId = restaurant._id;

    // Vérifier qu'il y a plusieurs articles
    if (!Array.isArray(req.body.articles) || req.body.articles.length < 2) {
      return res.status(400).json({
        message: 'A menu should have at least two articles',
      });
    }

    // verifier que tous les articles existent et appartiennent au même restaurant
    // Calculer le prix total du menu comme la somme des prix de tous les articles
    let totalPrice = 0;

    try {
      const articlePricePromises = req.body.articles.map(async (articleId) => {
        const article = await Article.findById(articleId);
        if (!article) {
          return res.status(400).json({
            message: 'Article not found',
          });
        }
        if (!article.restaurant_id.equals(restaurantId)) {
          console.log(article.restaurant_id, restaurantId);
          return res.status(400).json({
            message: 'All articles should belong to the same restaurant',
          });
        }
        return article;
      });

      const articles = await Promise.all(articlePricePromises);
      totalPrice = articles.reduce((total, article) => total + article.price, 0);
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
      price: totalPrice,
      articles: req.body.articles,
      restaurant_id: req.body.restaurant_id,
    });

    try {
      const createdMenu = await menu.save();
      return res.json({ id: createdMenu._id });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /menus/:id
  read: async (req, res) => {
    const { id } = req.params;

    try {
      const menu = await Menu.findById(id);
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
      console.log('Menu deleted');
      return res.json({ message: 'Menu deleted successfully' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

export default menuController;
