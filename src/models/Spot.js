import { model, Schema } from 'mongoose';

export default model(
  'Spot',
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    company: String,
    price: Number,
    thumbnail: String,
    techs: [String],
  })
);
