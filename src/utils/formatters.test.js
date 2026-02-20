import { describe, it, expect } from 'vitest';
import {
  nl2br,
  slugify,
  unslugify,
  truncate,
  sizeFormat,
  stripTags,
  replaceTags,
  toString,
  joinStr,
  normalizeString,
} from './formatters';

describe('Formatters', () => {
  describe('nl2br', () => {
    it('should convert newlines to br tags', () => {
      expect(nl2br('hello\nworld')).toBe('hello<br />\nworld');
    });

    it('should handle carriage return and newline', () => {
      expect(nl2br('hello\r\nworld')).toBe('hello<br />\r\nworld');
    });

    it('should handle empty string', () => {
      expect(nl2br('')).toBe('');
    });

    it('should handle string with no newlines', () => {
      expect(nl2br('hello world')).toBe('hello world');
    });
  });

  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace ampersands', () => {
      expect(slugify('Rock & Roll')).toBe('rock-and-roll');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should collapse multiple dashes', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should handle numbers', () => {
      expect(slugify('Sprint 1')).toBe('sprint-1');
    });
  });

  describe('unslugify', () => {
    it('should convert slug back to readable text', () => {
      expect(unslugify('hello-world')).toBe('Hello world');
    });

    it('should return falsy values as-is', () => {
      expect(unslugify(null)).toBe(null);
      expect(unslugify(undefined)).toBe(undefined);
      expect(unslugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const result = truncate('This is a long string that should be truncated', 20);
      expect(result.length).toBeLessThanOrEqual(24);
      expect(result).toContain('...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Short', 20)).toBe('Short');
    });

    it('should return non-string values as-is', () => {
      expect(truncate(123, 5)).toBe(123);
      expect(truncate(null, 5)).toBe(null);
    });

    it('should use custom suffix', () => {
      const result = truncate('This is a long string for testing', 10, '---');
      expect(result).toContain('---');
    });
  });

  describe('sizeFormat', () => {
    it('should format bytes', () => {
      expect(sizeFormat(500)).toBe('500.0 bytes');
    });

    it('should format kilobytes', () => {
      expect(sizeFormat(1024)).toBe('1.0 KB');
    });

    it('should format megabytes', () => {
      expect(sizeFormat(1048576)).toBe('1.0 MB');
    });

    it('should format gigabytes', () => {
      expect(sizeFormat(1073741824)).toBe('1.0 GB');
    });

    it('should return dash for invalid input', () => {
      expect(sizeFormat('invalid')).toBe('-');
      expect(sizeFormat(NaN)).toBe('-');
    });

    it('should return 0 bytes for zero', () => {
      expect(sizeFormat(0)).toBe('0 bytes');
    });

    it('should respect precision parameter', () => {
      expect(sizeFormat(1536, 2)).toBe('1.50 KB');
    });
  });

  describe('stripTags', () => {
    it('should remove all HTML tags', () => {
      expect(stripTags('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });

    it('should keep exception tags', () => {
      const result = stripTags('<p>Hello <b>World</b></p>', 'b');
      expect(result).toContain('<b>');
      expect(result).toContain('</b>');
    });
  });

  describe('replaceTags', () => {
    it('should replace HTML tags', () => {
      expect(replaceTags('<b>Hello</b>', 'b', 'strong')).toBe('<strong>Hello</strong>');
    });

    it('should handle multiple occurrences', () => {
      expect(replaceTags('<b>Hello</b> <b>World</b>', 'b', 'strong')).toBe(
        '<strong>Hello</strong> <strong>World</strong>'
      );
    });
  });

  describe('toString', () => {
    it('should convert number to string', () => {
      expect(toString(42)).toBe('42');
    });

    it('should return string as-is', () => {
      expect(toString('hello')).toBe('hello');
    });

    it('should stringify objects', () => {
      expect(toString({ a: 1 })).toBe('{"a":1}');
    });

    it('should return empty string for undefined', () => {
      expect(toString(undefined)).toBe('');
    });
  });

  describe('joinStr', () => {
    it('should join collection with separator', () => {
      expect(joinStr(', ', ['a', 'b', 'c'])).toBe('a, b, c');
    });

    it('should handle empty array', () => {
      expect(joinStr(', ', [])).toBe('');
    });
  });

  describe('normalizeString', () => {
    it('should normalize accented characters', () => {
      expect(normalizeString('ÁÉÍÓÚ')).toBe('AEIOU');
      expect(normalizeString('ÄËÏÖÜ')).toBe('AEIOU');
      expect(normalizeString('ÀÈÌÒÙ')).toBe('AEIOU');
    });

    it('should not modify non-accented characters', () => {
      expect(normalizeString('Hello World')).toBe('Hello World');
    });
  });
});
