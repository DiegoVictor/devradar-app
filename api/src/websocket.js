import socketio from 'socket.io';
import Connection from './app/models/Connection';

import parseStringAsArray from './app/helpers/parseStringAsArray';
import calculateDistance from './app/helpers/calculateDistance';

let io;

export function setupWebSocket(server) {
  io = socketio(server);

  io.on('connection', async socket => {
    const { latitude, longitude, techs } = socket.handshake.query;
    await Connection.save({
      socket_id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray.run(techs),
    });
  });

  io.on('disconnect', async socket => {
    const connection = await Connection.findById(socket.id);
    await connection.remove();
  });
}

export async function findConnection(coordinates, techs) {
  const connections = await Connection.find({ techs: { $in: techs } });
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10;
  });
}

export function sendMessage(to, message, data) {
  to.forEach(connection => {
    io.to(connection.socket_id).emit(message, data);
  });
}
