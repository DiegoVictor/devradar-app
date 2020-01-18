import socketio from 'socket.io';
import parseStringAsArray from './app/helpers/parseStringAsArray';
import calculateDistance from './app/helpers/calculateDistance';

const connections = [];
let io;

export const setupWebSocket = server => {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;
    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray.run(techs),
    });
  });
};

export const findConnection = (coordinates, techs) => {
  return connections.filter(connection => {
    if (connection.techs.some(tech => techs.includes(tech))) {
      return calculateDistance(coordinates, connection.coordinates) < 10;
    }
  });
};

export const sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
