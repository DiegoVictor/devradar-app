import { model, Schema } from 'mongoose';

const SpotSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    company: String,
    price: Number,
    thumbnail: String,
    techs: [String],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

SpotSchema.virtual('thumbnail_url').get(function getThumbnailUrl() {
  return `${process.env.APP_URL}:${process.env.APP_PORT}/files/${this.thumbnail}`;
});

export default model('Spot', SpotSchema);
