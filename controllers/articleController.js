import Article from '../models/articleModel.js';
import { image2WebpProduits } from '../utils/converter/imageConverter.js';
import logger from '../utils/logger/logger.js';

const articleController = {
  // POST /article/create
  create: async (req, res) => {
    const { restaurant } = req;
    // Vérifier si un article avec le même nom existe déjà
    const articleExists = await Article.findOne({
      name: req.body.name,
      restaurant_id: restaurant.id,
    });

    if (articleExists) {
      return res.status(400).json({
        message: 'Cet article existe déjà',
      });
    }

    const image = await image2WebpProduits(req.body.image);

    // Créer un nouvel article
    const article = new Article({
      name: req.body.name,
      image,
      description: req.body.description,
      price: req.body.price,
      restaurant_id: restaurant.id,
    });

    try {
      const createdArticle = await article.save();
      logger.log('info', `Article créé avec succès : ${createdArticle._id}`);
      return res.json({ id: createdArticle._id, message: 'Article créé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },

  // GET /article/:articleId
  read: async (req, res) => {
    const { articleId } = req.params;

    try {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }
      return res.json(article);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // DELETE /article/:articleId
  delete: async (req, res) => {
    const { articleId } = req.params;
    try {
      const article = await Article.findByIdAndDelete(articleId);
      if (!article) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }
      logger.log('info', `Article supprimé : ${article._id}`);

      return res.json({ message: 'Article supprimé avec succès' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // PUT /article/:articleId
  update: async (req, res) => {
    const { articleId } = req.params;
    const { restaurant } = req;

    try {
    // Vérifier si l'article existe
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }

      const { name } = req.body;
      if (name) {
        const existingName = await Article.findOne({
          name,
          restaurant_id: restaurant.id,
          _id: { $ne: articleId },
        });

        if (existingName) {
          return res.status(404).json({ message: 'Nom déjà présent dans les articles' });
        }
      }

      let { image } = req.body;
      if (image) {
        image = await image2WebpProduits(image);
      }

      // Mettre à jour les informations de l'article
      article.name = name || article.name;
      article.image = image || article.image;
      article.description = req.body.description || article.description;
      article.price = req.body.price || article.price;

      // Enregistrer les modifications
      const updatedArticle = await article.save();
      logger.log('info', `Article modifié : ${article._id}`);

      return res.json(updatedArticle);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

};

export default articleController;
