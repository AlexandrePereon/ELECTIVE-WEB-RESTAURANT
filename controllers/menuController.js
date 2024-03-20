import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';

const menuController = {
  // POST /menu/create
  create: async (req, res) => {
    // Vérifier qu'il y a plusieurs articles
    if (!Array.isArray(req.body.articles) || req.body.articles.length < 2) {
      return res.status(400).json({
        message: 'A menu should have at least two articles',
      });
    }

    // Calculer le prix total du menu comme la somme des prix de tous les articles
    let totalPrice = 0;
    try {
      const articlePromises = req.body.articles.map(async (articleId) => {
        const article = await Article.findById(articleId);
        if (!article) {
          return res.status(400).json({
            message: 'Article not found',
          });
        }
        return article;
      });

      const articles = await Promise.all(articlePromises);

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
    });

    try {
      const createdMenu = await menu.save();
      return res.json({ id: createdMenu._id });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

export default menuController;
