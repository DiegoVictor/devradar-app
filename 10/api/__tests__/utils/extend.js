expect.extend({
  toHaveBeenCalledWithMatch(func, ...expects) {
    const args = func.mock.calls.shift();

    function isEqual(a, b) {
      if (a instanceof Date) {
        if (b instanceof Date) {
          return a.toString() === b.toString();
        }
        return false;
      }

      switch (typeof a) {
        case 'object': {
          if (typeof b === 'object') {
            return Object.keys(b).every(prop => {
              if (!isEqual(a[prop], b[prop])) {
                return false;
              }
              return true;
            });
          }
          return false;
        }

        case 'string':
          if (typeof b === 'string') {
            return a === b;
          }
          return false;

        default:
          return a === b;
      }
    }

    const pass = Object.keys(expects).every(prop => {
      if (!isEqual(args[prop], expects[prop])) {
        return false;
      }
      return true;
    });

    return {
      pass,
    };
  },
});
