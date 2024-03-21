import Article from '../models/articleModel.js';

const articleController = {
  // POST /article/create
  create: async (req, res) => {
    const articleExists = await Article.findOne({
      $or: [
        { name: req.body.name },
      ],
    });

    if (articleExists) {
      return res.status(400).json({
        message: 'This article already exists',
      });
    }

    // create new article
    const article = new Article({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
    });

    try {
      const createdArticle = await article.save();
      console.log("j'ai créé un article");
      return res.json({ id: createdArticle._id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
};

export default articleController;
