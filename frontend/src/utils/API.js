// Backend API Interface Methods
import { BACKEND_PORT } from '../config.json';

const BASE = `http://localhost:${BACKEND_PORT}`

const buildRequest = (method, token = undefined, body = {}) => {
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

  updateQuiz: async (token, quizid, body) => {
    return await (await apiCall(`/admin/quiz/${quizid}`, 'PUT', token, body)).json();
  },

  startGame: async (token, quizid) => {
    return await (await apiCall(`/admin/quiz/${quizid}/start`, 'POST', token)).json();
  },

  advanceGame: async (token, quizid) => {
    return await (await apiCall(`/admin/quiz/${quizid}/advance`, 'POST', token)).json();
  },

  endGame: async (token, quizid) => {
    return await (await apiCall(`/admin/quiz/${quizid}/end`, 'POST', token)).json();
  },

  adminStatus: async (token, sessionid) => {
    return await (await apiCall(`/admin/session/${sessionid}/status`, 'GET', token)).json();
  },

  sessionResults: async (token, sessionid) => {
    return await (await apiCall(`/admin/session/${sessionid}/results`, 'GET', token)).json();
  },

  playerJoin: async (sessionid, name) => {
    const body = {
      name,
    };
    return await (await apiCall(`/play/join/${sessionid}`, 'POST', undefined, body)).json();
  },

  playerStatus: async (playerid) => {
    return await (await apiCall(`/play/${playerid}/status`, 'GET')).json();
  },

  getPlayerQuestion: async (playerid) => {
    return await (await apiCall(`/play/${playerid}/question`, 'GET')).json();
  },

  getCorrectAnswer: async (playerid) => {
    return await (await apiCall(`/play/${playerid}/answer`, 'GET')).json();
  },

  submitAnswer: async (playerid, answerIds) => {
    const body = {
      answerIds,
    };
    return await (await apiCall(`/play/${playerid}/answer`, 'PUT', undefined, body)).json();
  },

  getPlayerResults: async (playerid) => {
    return await (await apiCall(`/play/${playerid}/results`, 'GET')).json();
  }
}

export default API;
