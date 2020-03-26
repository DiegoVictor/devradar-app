import { createContext } from 'react';

let user = {};
if (typeof localStorage.bethehero_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('bethehero_user'));
}

export default createContext({
  user,
  set: () => {},
});
