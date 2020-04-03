import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { badRequest, unauthorized } from '@hapi/boom';

export default async (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw badRequest('Token not provided', { code: 340 });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.ong_id = decoded.id;
  } catch (err) {
    throw unauthorized('Token invalid', 'sample', { code: 341 });
  }

  return next();
};
