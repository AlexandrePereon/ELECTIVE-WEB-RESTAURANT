import mongoose from 'mongoose';

const { Schema } = mongoose;
const Menu = mongoose.model('Menu', {
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
});

export default Menu;
