export const emit = jest.fn();

export const to = jest.fn(() => {
  return { emit };
});

let callback;
export const run = socket => {
  callback(socket);
};

export const on = jest.fn((event, cb) => {
  callback = cb;
});

export default () => ({
  to,
  emit,
  on,
  io: {
    opts: {
      query: {},
    },
  },
  connect: jest.fn(),
  disconnect: jest.fn(),
});
