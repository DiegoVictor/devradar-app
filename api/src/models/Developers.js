import { Schema, model } from 'mongoose';

export default model(
  'Developer',
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      user: {
        type: String,
        required: true,
      },
      bio: String,
      avatar: {
        type: String,
        required: true,
      },
      likes: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Developer',
        },
      ],
      dislikes: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Developer',
        },
      ],
    },
    { timestamps: true }
  )
);
