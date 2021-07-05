import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

export default axios.create({
  baseURL: API_URL,
});
