import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { healthCheck } from './api';
import { STORAGE_KEYS } from '../utils/constants';

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should import and setup API module correctly', () => {
    expect(api).toBeDefined();
    expect(healthCheck).toBeDefined();
    expect(typeof healthCheck).toBe('function');
  });

  it('should have correct API base URL configured', () => {
    const expectedUrl = 'https://api.taiga.io/api/v1';
    expect(api.defaults.baseURL).toBe(expectedUrl);
  });

  it('should have request interceptors configured', () => {
    expect(api.interceptors.request.handlers.length).toBeGreaterThan(0);
  });

  it('should have response interceptors configured', () => {
    expect(api.interceptors.response.handlers.length).toBeGreaterThan(0);
  });

  it('should add auth token to request headers when token exists', () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');

    const requestInterceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    const result = requestInterceptor.fulfilled(config);

    expect(result.headers['Authorization']).toBe('Bearer test-token');
  });

  it('should not add auth token when no token exists', () => {
    const requestInterceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    const result = requestInterceptor.fulfilled(config);

    expect(result.headers['Authorization']).toBeUndefined();
  });

  it('should add Accept-Language header with default language', () => {
    const requestInterceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    const result = requestInterceptor.fulfilled(config);

    expect(result.headers['Accept-Language']).toBe('en');
  });

  it('should add Accept-Language header with stored language', () => {
    localStorage.setItem(STORAGE_KEYS.LANG, 'es');

    const requestInterceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    const result = requestInterceptor.fulfilled(config);

    expect(result.headers['Accept-Language']).toBe('es');
  });

  it('should successfully connect to Taiga public API', async () => {
    const result = await healthCheck();

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('healthy');

    if (result.status === 'healthy') {
      expect(result).toHaveProperty('data');
    }
  }, 10000);
});
