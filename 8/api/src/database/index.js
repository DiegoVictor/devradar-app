import Mongoose from 'mongoose';

class Database {
  constructor() {
    Mongoose.connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
}

export default new Database();
