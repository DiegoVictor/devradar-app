let callback;
export const emit = payload => {
  callback(payload);
};

export const on = jest.fn((event, cb) => {
  callback = cb;
});

export default (url, options) => ({
  url,
  options,
  on,
});
