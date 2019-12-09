import Mongoose from 'mongoose';

class Database {
  constructor() {
    const { DB_HOST, DB_PORT, DB_NAME } = process.env;

    Mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
}

export default new Database();
