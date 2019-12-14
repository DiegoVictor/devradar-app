import { MongoMemoryServer } from 'mongodb-memory-server';
import Mongoose from 'mongoose';

const mongod = new MongoMemoryServer({
  instance: {
    ip: '127.0.0.1',
    dbName: 'jest',
    port: 27018,
  },
  autoStart: false,
  debug: true,
});

module.exports = async () => {
  process.env.MONGO_URL = await mongod.getConnectionString();
  await Mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  global.__MONGOD__ = mongod;
};
