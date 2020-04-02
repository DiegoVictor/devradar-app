import closeRedis from '../../utils/close_redis';
import instance from '../../../src/database/redis';
import RateLimit from '../../../src/app/middlewares/RateLimit';

describe('RateLimit', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  afterAll(async () => {
    await closeRedis(instance);
  });

  it('should be able to consume the api', async () => {
    await RateLimit({}, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should not be able to consume after many requests', async () => {
    const requests = [];
    for (let i = 0; i < 61; i += 1) {
      requests.push(RateLimit({}, res, next));
    }

    await Promise.all(requests);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Too Many Requests',
      },
    });
  });
});
