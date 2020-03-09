import { model, Schema } from 'mongoose';

export default model(
  'Booking',
  new Schema({
    date: Date,
    approved: Boolean,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot',
    },
  })
);
