import { describe, it, expect, vi } from 'vitest';
import api, { healthCheck } from './api';

describe('API Service', () => {
  it('should import and setup API module correctly', async () => {
    expect(api).toBeDefined();
    expect(healthCheck).toBeDefined();
    expect(typeof healthCheck).toBe('function');
  });

  it('should successfully connect to Taiga public API', async () => {
    // Mock console to keep test output clean
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Test actual API connection
    const result = await healthCheck();
    
    // The Taiga API should be accessible
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('healthy');
    
    // If healthy, should have data
    if (result.status === 'healthy') {
      expect(result).toHaveProperty('data');
    }
    
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  }, 10000); // Allow 10 seconds for network request

  it('should have correct API base URL configured', () => {
    const expectedUrl = 'https://api.taiga.io/api/v1';
    expect(api.defaults.baseURL).toBe(expectedUrl);
  });
});
