import { Schema, model } from 'mongoose';

export default model(
  'Connection',
  new Schema({
    socket_id: String,
    coordinates: {
      type: new Schema({
        latitude: Number,
        longitude: Number,
      }),
    },
    techs: [String],
  })
);
