import dotenv from 'dotenv';

dotenv.config({
  path: (() => {
    if (process.env.NODE_ENV === 'test') {
      return '.env.test';
    }
    return '.env';
  })(),
});
