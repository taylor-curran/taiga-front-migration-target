import api from './api';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh';
const USER_KEY = 'userInfo';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth', {
      username,
      password,
      type: 'normal',
    });
    const user = response.data;
    localStorage.setItem(TOKEN_KEY, user.auth_token);
    if (user.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, user.refresh);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async ({ username, full_name, email, password }) => {
    const response = await api.post('/auth/register', {
      username,
      full_name,
      email,
      password,
      type: 'public',
    });
    const user = response.data;
    localStorage.setItem(TOKEN_KEY, user.auth_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
