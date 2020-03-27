import crypto from 'crypto';

export default () => {
  return crypto.randomBytes(4).toString('HEX');
};
