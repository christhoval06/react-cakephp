export function format(formatted) {
  var params = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < params.length; i++) {
    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, params[i]);
  }
  return formatted;
}

export function isNullOrEmpty(str) {
    return (!str || /^\s*$/.test(str));
}
