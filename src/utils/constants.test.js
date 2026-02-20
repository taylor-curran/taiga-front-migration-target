import { describe, it, expect } from 'vitest';
import {
  API_BASE_URL,
  DEFAULT_LANGUAGE,
  DEFAULT_COLOR_LIST,
  CUSTOM_FIELD_TYPES,
  CUSTOM_FIELD_TYPE_CHOICES,
  NAV_URLS,
  STORAGE_KEYS,
  HTTP_STATUS,
  PROJECT_TYPES,
  NOTIFY_LEVELS,
} from './constants';

describe('Constants', () => {
  describe('API_BASE_URL', () => {
    it('should be the Taiga API URL', () => {
      expect(API_BASE_URL).toBe('https://api.taiga.io/api/v1');
    });
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('should be English', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });
  });

  describe('DEFAULT_COLOR_LIST', () => {
    it('should contain 21 colors', () => {
      expect(DEFAULT_COLOR_LIST).toHaveLength(21);
    });

    it('should contain valid hex colors', () => {
      DEFAULT_COLOR_LIST.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should contain the specific first color', () => {
      expect(DEFAULT_COLOR_LIST[0]).toBe('#D35163');
    });
  });

  describe('CUSTOM_FIELD_TYPES', () => {
    it('should have all expected field types', () => {
      expect(CUSTOM_FIELD_TYPES.TEXT).toBe('text');
      expect(CUSTOM_FIELD_TYPES.MULTILINE).toBe('multiline');
      expect(CUSTOM_FIELD_TYPES.RICHTEXT).toBe('richtext');
      expect(CUSTOM_FIELD_TYPES.DATE).toBe('date');
      expect(CUSTOM_FIELD_TYPES.URL).toBe('url');
      expect(CUSTOM_FIELD_TYPES.DROPDOWN).toBe('dropdown');
      expect(CUSTOM_FIELD_TYPES.CHECKBOX).toBe('checkbox');
      expect(CUSTOM_FIELD_TYPES.NUMBER).toBe('number');
    });

    it('should have exactly 8 field types', () => {
      expect(Object.keys(CUSTOM_FIELD_TYPES)).toHaveLength(8);
    });
  });

  describe('CUSTOM_FIELD_TYPE_CHOICES', () => {
    it('should have 8 choices', () => {
      expect(CUSTOM_FIELD_TYPE_CHOICES).toHaveLength(8);
    });

    it('should have key and name for each choice', () => {
      CUSTOM_FIELD_TYPE_CHOICES.forEach((choice) => {
        expect(choice).toHaveProperty('key');
        expect(choice).toHaveProperty('name');
      });
    });
  });

  describe('NAV_URLS', () => {
    it('should have home URL', () => {
      expect(NAV_URLS.home).toBe('/');
    });

    it('should have login URL', () => {
      expect(NAV_URLS.login).toBe('/login');
    });

    it('should have project URL with parameter', () => {
      expect(NAV_URLS.project).toBe('/project/:project');
    });

    it('should have discover URL', () => {
      expect(NAV_URLS.discover).toBe('/discover');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have token key', () => {
      expect(STORAGE_KEYS.TOKEN).toBe('token');
    });

    it('should have refresh token key', () => {
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh');
    });

    it('should have user info key', () => {
      expect(STORAGE_KEYS.USER_INFO).toBe('userInfo');
    });

    it('should have lang key', () => {
      expect(STORAGE_KEYS.LANG).toBe('lang');
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have standard HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    });
  });

  describe('PROJECT_TYPES', () => {
    it('should have scrum and kanban types', () => {
      expect(PROJECT_TYPES.SCRUM).toBe('scrum');
      expect(PROJECT_TYPES.KANBAN).toBe('kanban');
    });
  });

  describe('NOTIFY_LEVELS', () => {
    it('should have notify level values', () => {
      expect(NOTIFY_LEVELS.INVOLVED).toBe(1);
      expect(NOTIFY_LEVELS.ALL).toBe(2);
      expect(NOTIFY_LEVELS.NONE).toBe(3);
    });
  });
});
