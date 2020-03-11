import * as Yup from 'yup';
import { badRequest } from '@hapi/boom';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      latitude: Yup.string()
        .required()
        .strict(),
      longitude: Yup.string()
        .required()
        .strict(),
      techs: Yup.string()
        .required()
        .strict(),
    });

    await schema.validate(req.query, { abortEarly: false });

    return next();
  } catch (err) {
    throw badRequest('Validation fails', err.inner);
  }
};
