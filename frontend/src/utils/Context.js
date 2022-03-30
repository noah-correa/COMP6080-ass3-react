import { createContext, useContext } from 'react';

export const initialValue = {
  content: {},
  loaded: false,
  loggedIn: false,
  title: 'BigBrain',
  token: undefined,
};

export const Context = createContext(initialValue);
const useAppContext = () => useContext(Context);
export default useAppContext;
