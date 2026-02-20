export const isImage = (name) => {
  return name.match(/\.(jpe?g|png|gif|gifv|svg|psd|webp)/i) !== null;
};

export const isEmail = (name) => {
  if (name == null) return false;
  return (
    name.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null
  );
};

export const isPdf = (name) => {
  return name.match(/\.(pdf)/i) !== null;
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const minLength = (value, min) => {
  if (typeof value !== 'string') return false;
  return value.length >= min;
};

export const maxLength = (value, max) => {
  if (typeof value !== 'string') return false;
  return value.length <= max;
};
