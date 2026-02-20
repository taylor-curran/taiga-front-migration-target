import api from './api';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth', {
      type: 'normal',
      username,
      password,
    });
    const userData = response.data;
    if (userData.auth_token) {
      localStorage.setItem(TOKEN_KEY, userData.auth_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.auth_token}`;
    }
    return userData;
  },

  async register({ username, full_name, email, password }) {
    const response = await api.post('/auth/register', {
      type: 'public',
      username,
      full_name,
      email,
      password,
      accepted_terms: true,
    });
    const userData = response.data;
    if (userData.auth_token) {
      localStorage.setItem(TOKEN_KEY, userData.auth_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.auth_token}`;
    }
    return userData;
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  async updateUserProfile(userId, data) {
    const response = await api.patch(`/users/${userId}`, data);
    const userData = response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return userData;
  },

  async changePassword(currentPassword, newPassword) {
    await api.post('/users/change_password', {
      current_password: currentPassword,
      password: newPassword,
    });
  },
};
