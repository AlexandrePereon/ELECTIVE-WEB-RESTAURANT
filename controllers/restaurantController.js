import Restaurant from '../models/restaurantModel.js';

const restaurantController = {
  // POST /restaurant/create
  create: async (req, res) => {
    console.log(req.body);
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
      createur_id: req.body.createur_id,
    });

    try {
      const createdRestaurant = await restaurant.save();
      return res.json({ id: createdRestaurant._id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
};

export default restaurantController;
