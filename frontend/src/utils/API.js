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

const API = {
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

  getAllQuizzes: async (token) => {
    return await (await apiCall('/admin/quiz', 'GET', token)).json();
  },

  getQuiz: async (token, quizid) => {
    return await (await apiCall(`/admin/quiz/${quizid}`, 'GET', token)).json();
  },

  createQuiz: async (token, name) => {
    const body = {
      name,
    };
    return await (await apiCall('/admin/quiz/new', 'POST', token, body)).json();
  },

  deleteQuiz: async (token, quizid) => {
    return await (await apiCall(`/admin/quiz/${quizid}`, 'DELETE', token)).json();
  },
}

export default API;
