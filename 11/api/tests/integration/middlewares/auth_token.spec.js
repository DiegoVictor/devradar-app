import 'dotenv/config';
import faker from 'faker';

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
    await AuthToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Token not provided',
      },
    });
  });

  it('should not be authorizated without send a valid token', async () => {
    const req = {
      headers: {
        authorization: faker.random.alphaNumeric(32),
      },
    };
    await AuthToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Token invalid',
      },
    });
  });
});
