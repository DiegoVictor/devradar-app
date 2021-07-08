module.exports = (request, options) => {
  let path = options.defaultResolver(request, options);
  ['socket.io-client', 'expo-location', 'react-native-maps'].every(filename => {
    if (request.search(new RegExp(filename, 'gi')) > -1) {
      path = `${options.rootDir}/mocks/${filename}.js`;
      return false;
    }
    return true;
  });
  return path;
};
