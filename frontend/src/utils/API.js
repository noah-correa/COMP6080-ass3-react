// Backend API Interface Methods
import { BACKEND_PORT } from '../config.json';

const BASE = `http://localhost:${BACKEND_PORT}`

const buildRequest = (method, token, body = {}) => {
  const req = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (token) req.headers = { ...req.headers, Authorization: token };
  if (method !== 'GET') req.body = JSON.stringify(body);
  return req;
}

const apiCall = async (route, method, token, body) => {
  return fetch(`${BASE}${route}`, buildRequest(method, token, body));
}

const apiMethods = {
  register: async (email, password, name) => {
    const body = {
      email,
      password,
      name,
    };
    return await (await apiCall('/admin/auth/register', 'POST', undefined, body)).json();
  },

  login: async (email, password) => {
    const body = {
      email,
      password,
    };
    return await (await apiCall('/admin/auth/login', 'POST', undefined, body)).json();
  },

  logout: async (token) => {
    return await (await apiCall('/admin/auth/logout', 'POST', token)).json();
  },
}

export default apiMethods;
