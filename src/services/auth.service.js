import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const login = async (username, password, type = 'normal') => {
  const response = await api.post('/auth', {
    username,
    password,
    type,
  });
  const user = response.data;

  localStorage.setItem(STORAGE_KEYS.TOKEN, user.auth_token);
  if (user.refresh) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, user.refresh);
  }
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

  return user;
};

export const register = async (data, type = 'public', existing = false) => {
  const payload = { ...data, type };
  if (type === 'private') {
    payload.existing = existing;
  }

  const response = await api.post('/auth/register', payload);
  const user = response.data;

  localStorage.setItem(STORAGE_KEYS.TOKEN, user.auth_token);
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

  return user;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

export const forgotPassword = async (email) => {
  const response = await api.post('/users/password_recovery', { username: email });
  return response.data;
};

export const changePasswordFromRecovery = async (token, password) => {
  const response = await api.post('/users/change_password_from_recovery', {
    token,
    password,
  });
  return response.data;
};

export const changeEmail = async (emailToken) => {
  const response = await api.post('/users/change_email', { email_token: emailToken });
  return response.data;
};

export const cancelAccount = async (cancelToken) => {
  const response = await api.post('/users/cancel', { cancel_token: cancelToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const isAuthenticated = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) !== null;
};

export const getStoredUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const refreshUserData = async () => {
  const response = await api.get('/users/me');
  const user = response.data;
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
  return user;
};
