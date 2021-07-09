import { act } from '@testing-library/react-native';

async function wait(expectation) {
  const startTime = Date.now();

  return await act(async () => {
    return new Promise((resolve, reject) => {
      const rejectOrRerun = (error) => {
        if (Date.now() - startTime >= 4500) {
          reject(error);
          return;
        }
        setTimeout(runExpectation, 50);
      };
      function runExpectation() {
        try {
          const result = expectation();
          resolve(result);
        } catch (error) {
          rejectOrRerun(error);
        }
      }
      setTimeout(runExpectation, 0);
    });
  });
}

export default wait;
