function isValidHexadecimalColor(color) {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
}

module.exports = { isValidHexadecimalColor };
