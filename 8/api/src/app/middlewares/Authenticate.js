import { unauthorized } from '@hapi/boom';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw unauthorized('Token not provided');
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.user_id = decoded.id;
  } catch (err) {
    throw unauthorized('Token invalid');
  }

  return next();
};
