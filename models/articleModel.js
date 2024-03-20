import mongoose from 'mongoose';

const Article = mongoose.model('Article', {
  name: {
    type: String,
    required: true,
    unique: true,
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
  price: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
});

export default Article;
