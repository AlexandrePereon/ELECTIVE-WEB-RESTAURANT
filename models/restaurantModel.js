import mongoose from 'mongoose';
import Article from './articleModel.js';
import Menu from './menuModel.js';

const { Schema } = mongoose;

const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createur_id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
});

RestaurantSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const restaurant = this;
    await Article.deleteMany({ restaurant_id: restaurant._id });
    await Menu.deleteMany({ restaurant_id: restaurant._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

export default Restaurant;
