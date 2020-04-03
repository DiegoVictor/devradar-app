import 'dotenv/config';
import faker from 'faker';
import { badRequest, unauthorized } from '@hapi/boom';

import AuthToken from '../../../src/app/middlewares/AuthToken';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import token from '../../utils/jwtoken';

describe('AuthToken', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be authorizated', async () => {
    const ong = await factory.attrs('Ong');
    await connection('ongs').insert(ong);

    const req = {
      headers: {
        authorization: `Bearer ${token(ong.id)}`,
      },
    };
    await AuthToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should not be authorizated without send a token', async () => {
    const req = {
      headers: {},
    };

    let response;
    try {
      await AuthToken(req, res, next);
    } catch (err) {
      response = err;
    }

    expect(response).toStrictEqual(
      badRequest('Token not provided', { code: 340 })
    );
  });

  it('should not be authorizated without send a valid token', async () => {
    const req = {
      headers: {
        authorization: faker.random.alphaNumeric(32),
      },
    };

    let response;
    try {
      await AuthToken(req, res, next);
    } catch (err) {
      response = err;
    }

    expect(response).toStrictEqual(
      unauthorized('Token invalid', 'sample', { code: 341 })
    );
  });
});
