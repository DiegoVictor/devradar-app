import { promisify } from 'util';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      error: {
        message: 'Token not provided',
      },
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.ong_id = decoded.id;
  } catch (err) {
    return res.status(401).json({
      error: {
        message: 'Token invalid',
      },
    });
  }

  return next();
};
