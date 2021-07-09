const callbacks = {};
export const emit = (event, payload) => {
  callbacks[event](payload);
};

export const on = jest.fn((event, cb) => {
  callbacks[event] = cb;
});

export default (url, options) => ({
  url,
  options,
  on,
  connect: jest.fn(),
  disconnect: jest.fn(),
  io: {
    opts: {
      query: {},
    },
  },
});
