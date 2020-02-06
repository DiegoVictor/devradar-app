export const emit = jest.fn();

export const to = jest.fn(() => {
  return { emit };
});

const callback = {};
export const connect = socket => {
  callback.connect(socket);
};

export const on = jest.fn((event, cb) => {
  callback[event] = cb;
});

export default () => ({
  to,
  emit,
  on,
});
