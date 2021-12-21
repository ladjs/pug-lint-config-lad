const assert = require('assert');

exports.htmlTagBoundaryTypes = [
  ':',
  'start-pug-interpolation',
  'end-pug-interpolation',
  'newline',
  'indent',
  'outdent',
  'eos'
];

exports.validateTrueOptions = function (name, options) {
  assert(
    options === true,
    name + ' option requires a true value or should be removed'
  );
};
