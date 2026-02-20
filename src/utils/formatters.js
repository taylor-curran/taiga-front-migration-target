import _ from 'lodash';

export const nl2br = (str) => {
  const breakTag = '<br />';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

export const slugify = (data) => {
  return data
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const unslugify = (data) => {
  if (data) {
    return _.capitalize(data.replace(/-/g, ' '));
  }
  return data;
};

export const truncate = (str, maxLength, suffix = '...') => {
  if (typeof str !== 'string' && !(str instanceof String)) {
    return str;
  }

  let out = str.slice(0);

  if (out.length > maxLength) {
    out = out.substring(0, maxLength + 1);
    out = out.substring(0, Math.min(out.length, out.lastIndexOf(' ')));
    out = out + suffix;
  }

  return out;
};

export const sizeFormat = (input, precision = 1) => {
  if (isNaN(parseFloat(input)) || !isFinite(input)) {
    return '-';
  }

  if (input === 0) {
    return '0 bytes';
  }

  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let number = Math.floor(Math.log(input) / Math.log(1024));
  if (number > 5) {
    number = 5;
  }
  const size = (input / Math.pow(1024, number)).toFixed(precision);
  return `${size} ${units[number]}`;
};

export const stripTags = (str, exception) => {
  if (exception) {
    const pattern = new RegExp('<(?!\\/?(' + exception + ')\\s*\\/?>)[^>]+>', 'gi');
    return String(str).replace(pattern, '');
  }
  return String(str).replace(/<\/?[^>]+>/g, '');
};

export const replaceTags = (str, tags, replace) => {
  let result = str;
  let pattern = new RegExp('<(' + tags + ')>', 'gi');
  result = result.replace(pattern, '<' + replace + '>');

  pattern = new RegExp('<\\/(' + tags + ')>', 'gi');
  result = result.replace(pattern, '</' + replace + '>');

  return result;
};

export const toString = (value) => {
  if (_.isNumber(value)) {
    return value + '';
  } else if (_.isString(value)) {
    return value;
  } else if (_.isPlainObject(value)) {
    return JSON.stringify(value);
  } else if (_.isUndefined(value)) {
    return '';
  }
  return value.toString();
};

export const joinStr = (str, coll) => {
  return coll.join(str);
};

export const normalizeString = (string) => {
  let normalized = string;
  normalized = normalized.replace(/Á/g, 'A').replace(/Ä/g, 'A').replace(/À/g, 'A');
  normalized = normalized.replace(/É/g, 'E').replace(/Ë/g, 'E').replace(/È/g, 'E');
  normalized = normalized.replace(/Í/g, 'I').replace(/Ï/g, 'I').replace(/Ì/g, 'I');
  normalized = normalized.replace(/Ó/g, 'O').replace(/Ö/g, 'O').replace(/Ò/g, 'O');
  normalized = normalized.replace(/Ú/g, 'U').replace(/Ü/g, 'U').replace(/Ù/g, 'U');
  return normalized;
};
