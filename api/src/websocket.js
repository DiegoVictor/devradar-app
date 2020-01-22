import Socket from 'socket.io';
import redis from 'redis';
// eslint-disable-next-line import/no-extraneous-dependencies
import redis_mock from 'redis-mock';

let { createClient } = redis;
if (process.env.NODE_ENV === 'test') {
  createClient = redis_mock.createClient;
}

const client = createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

let io;

export function setupWebSocket(server) {
  io = Socket(server);

  io.on('connection', async socket => {
    const { developer_id } = socket.handshake.query;
    client.set(developer_id.toString(), socket.id);
  });
}

export async function findConnection(id) {
  const socket_id = await new Promise(resolve => {
    client.get(id.toString(), (err, reply) => {
      resolve(Number(reply));
    });
  });

  if (typeof socket_id === 'number') {
    return socket_id;
  }
  return null;
}

export function emit(to, event, message) {
  io.to(to).emit(event, message);
}
