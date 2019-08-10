import axios from 'axios';
import { host, port } from '../config/app';

const Api = axios.create({
  baseURL: `${host}:${port}`
});

export default Api;