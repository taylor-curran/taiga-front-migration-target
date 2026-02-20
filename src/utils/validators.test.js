import { describe, it, expect } from 'vitest';
import {
  isImage,
  isEmail,
  isPdf,
  isRequired,
  isValidUrl,
  isNumber,
  minLength,
  maxLength,
} from './validators';

describe('Validators', () => {
  describe('isImage', () => {
    it('should return true for image extensions', () => {
      expect(isImage('photo.jpg')).toBe(true);
      expect(isImage('photo.jpeg')).toBe(true);
      expect(isImage('photo.png')).toBe(true);
      expect(isImage('photo.gif')).toBe(true);
      expect(isImage('photo.svg')).toBe(true);
      expect(isImage('photo.webp')).toBe(true);
      expect(isImage('photo.psd')).toBe(true);
      expect(isImage('photo.gifv')).toBe(true);
    });

    it('should return false for non-image extensions', () => {
      expect(isImage('document.pdf')).toBe(false);
      expect(isImage('file.txt')).toBe(false);
      expect(isImage('script.js')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isImage('photo.JPG')).toBe(true);
      expect(isImage('photo.PNG')).toBe(true);
    });
  });

  describe('isEmail', () => {
    it('should return true for valid emails', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('user.name@example.com')).toBe(true);
      expect(isEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('invalid@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isEmail(null)).toBe(false);
      expect(isEmail(undefined)).toBe(false);
    });
  });

  describe('isPdf', () => {
    it('should return true for PDF files', () => {
      expect(isPdf('document.pdf')).toBe(true);
      expect(isPdf('document.PDF')).toBe(true);
    });

    it('should return false for non-PDF files', () => {
      expect(isPdf('image.png')).toBe(false);
      expect(isPdf('file.txt')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should return true for non-empty values', () => {
      expect(isRequired('hello')).toBe(true);
      expect(isRequired(42)).toBe(true);
      expect(isRequired(true)).toBe(true);
    });

    it('should return false for empty/null/undefined values', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber('42')).toBe(true);
      expect(isNumber('3.14')).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('abc')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should validate minimum length', () => {
      expect(minLength('hello', 3)).toBe(true);
      expect(minLength('hi', 3)).toBe(false);
      expect(minLength('abc', 3)).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(minLength(123, 3)).toBe(false);
      expect(minLength(null, 3)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length', () => {
      expect(maxLength('hi', 5)).toBe(true);
      expect(maxLength('hello world', 5)).toBe(false);
      expect(maxLength('hello', 5)).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(maxLength(123, 5)).toBe(false);
      expect(maxLength(null, 5)).toBe(false);
    });
  });
});
