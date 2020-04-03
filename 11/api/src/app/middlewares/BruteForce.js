import {
  free_retries,
  min_wait,
  max_wait,
  lifetime,
  prefix,
} from '../../config/bruteforce.json';
import BruteForce from '../../lib/BruteForce';

export default new BruteForce({
  freeRetries: free_retries,
  minWait: min_wait,
  maxWait: max_wait,
  lifetime,
  prefix,
});
