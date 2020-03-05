let callback;
export function emit(payload) {
  callback(payload);
}

export function on(event, cb) {
  callback = cb;
}

export default (url, options) => ({
  url,
  options,
  on,
  io: {
    opts: {
      query: {},
    },
  },
  disconnect: jest.fn(),
  connect: jest.fn(),
});
