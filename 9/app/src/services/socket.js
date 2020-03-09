import io from 'socket.io-client';
import { API_URL } from 'react-native-dotenv';

const socket = io(API_URL, {
  autoConnect: false,
});

export function connect(query) {
  if (typeof query === 'object') {
    socket.io.opts.query = query;
  }
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
