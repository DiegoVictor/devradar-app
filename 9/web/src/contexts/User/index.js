import { createContext } from 'react';

let user = {};
if (typeof localStorage.aircnc_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('aircnc_user'));
}

export const UserContext = createContext(user);
