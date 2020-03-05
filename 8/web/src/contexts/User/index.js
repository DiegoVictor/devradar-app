import { createContext } from 'react';

let user = {};
if (typeof localStorage.tindev_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('tindev_user'));
}

export const UserContext = createContext(user);
