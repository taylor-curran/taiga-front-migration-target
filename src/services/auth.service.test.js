import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from './auth.service';
import { STORAGE_KEYS } from '../utils/constants';

vi.mock('./api', () => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { baseURL: 'https://api.taiga.io/api/v1' },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mockApi };
});

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call api with correct parameters', async () => {
      const { default: api } = await import('./api');
      const mockUser = { auth_token: 'test-token', refresh: 'refresh-token', username: 'user' };
      api.post.mockResolvedValue({ data: mockUser });

      const result = await authService.login('user', 'pass');

      expect(api.post).toHaveBeenCalledWith('/auth', {
        username: 'user',
        password: 'pass',
        type: 'normal',
      });
      expect(result).toEqual(mockUser);
    });

    it('should store tokens in localStorage after login', async () => {
      const { default: api } = await import('./api');
      const mockUser = { auth_token: 'test-token', refresh: 'refresh-token' };
      api.post.mockResolvedValue({ data: mockUser });

      await authService.login('user', 'pass');

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('test-token');
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('refresh-token');
      expect(localStorage.getItem(STORAGE_KEYS.USER_INFO)).toBe(JSON.stringify(mockUser));
    });

    it('should support custom login type', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: { auth_token: 'token' } });

      await authService.login('user', 'pass', 'ldap');

      expect(api.post).toHaveBeenCalledWith('/auth', {
        username: 'user',
        password: 'pass',
        type: 'ldap',
      });
    });
  });

  describe('register', () => {
    it('should call api with correct parameters', async () => {
      const { default: api } = await import('./api');
      const mockUser = { auth_token: 'new-token', username: 'newuser' };
      api.post.mockResolvedValue({ data: mockUser });

      const data = { username: 'newuser', password: 'pass', email: 'user@test.com' };
      const result = await authService.register(data);

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        ...data,
        type: 'public',
      });
      expect(result).toEqual(mockUser);
    });

    it('should include existing flag for private registration', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: { auth_token: 'token' } });

      await authService.register({ username: 'user' }, 'private', true);

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'user',
        type: 'private',
        existing: true,
      });
    });
  });

  describe('logout', () => {
    it('should clear all auth data from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'token');
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
      localStorage.setItem(STORAGE_KEYS.USER_INFO, '{}');

      authService.logout();

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER_INFO)).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should call api with email', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await authService.forgotPassword('user@test.com');

      expect(api.post).toHaveBeenCalledWith('/users/password_recovery', {
        username: 'user@test.com',
      });
    });
  });

  describe('changePasswordFromRecovery', () => {
    it('should call api with token and password', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await authService.changePasswordFromRecovery('token123', 'newpass');

      expect(api.post).toHaveBeenCalledWith('/users/change_password_from_recovery', {
        token: 'token123',
        password: 'newpass',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user from api', async () => {
      const { default: api } = await import('./api');
      const mockUser = { id: 1, username: 'testuser' };
      api.get.mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'some-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getStoredUser', () => {
    it('should return parsed user data from localStorage', () => {
      const user = { id: 1, username: 'test' };
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

      expect(authService.getStoredUser()).toEqual(user);
    });

    it('should return null when no user data', () => {
      expect(authService.getStoredUser()).toBeNull();
    });
  });

  describe('refreshUserData', () => {
    it('should fetch and store updated user data', async () => {
      const { default: api } = await import('./api');
      const mockUser = { id: 1, username: 'updated' };
      api.get.mockResolvedValue({ data: mockUser });

      const result = await authService.refreshUserData();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
      expect(localStorage.getItem(STORAGE_KEYS.USER_INFO)).toBe(JSON.stringify(mockUser));
    });
  });
});
