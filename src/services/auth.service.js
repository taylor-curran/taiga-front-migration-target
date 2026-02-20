import api from './api';

const TOKEN_KEY = 'taiga-auth-token';
const USER_KEY = 'taiga-user';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth', {
      type: 'normal',
      username,
      password,
    });
    const userData = response.data;
    localStorage.setItem(TOKEN_KEY, userData.auth_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.auth_token}`;
    return userData;
  },

  async register(username, password, email, full_name) {
    const response = await api.post('/auth/register', {
      type: 'public',
      username,
      password,
      email,
      full_name,
      accepted_terms: true,
    });
    const userData = response.data;
    localStorage.setItem(TOKEN_KEY, userData.auth_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.auth_token}`;
    return userData;
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return user;
      }
    } catch (e) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;
