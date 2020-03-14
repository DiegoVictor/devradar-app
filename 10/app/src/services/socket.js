import socketio from 'socket.io-client';
import Constants from 'expo-constants';

const { API_URL } = Constants.manifest.extra;

const socket = socketio(API_URL, {
  autoConnect: false,
});

export function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  };
  socket.connect();
}

export function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export function subscribe(event, callback) {
  socket.on(event, callback);
}

export default socket;
