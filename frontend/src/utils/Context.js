import { createContext, useContext } from 'react';

export const initialValue = {
  loggedIn: false,
  title: 'BigBrain',
  token: undefined,
  sidebarOpen: false,
};

export const Context = createContext(initialValue);
const useAppContext = () => useContext(Context);
export default useAppContext;
