// # validateDivTags: `true`
//
// Checks that Pug does not contain any unnecessary `div` tags.
//
// ```pug
// //- Invalid
// div.class
// div#id
// div.class(class='class')
//
// //- Valid
// .class
// #id
// .class(class='class')
// div(class='class').class
// ```

const utils = require('../utils');

module.exports = function () {};

module.exports.prototype = {
  name: 'validateDivTags',

  schema: {
    enum: [null, true]
  },

  configure(options) {
    utils.validateTrueOptions(this.name, options);
  },

  lint(file, errors) {
    let isXml;

    file.iterateTokensByType('doctype', function (token) {
      isXml = token.val === 'xml';
    });

    if (!isXml) {
      file.iterateTokensByFilter(
        function (token) {
          return (
            token.type === 'tag' &&
            token.val === 'div' &&
            file.getNextToken(token) &&
            file.getNextToken(token).type !== 'start-attributes'
          );
        },
        function (token) {
          const current = token;
          const currentLineTokens = file.getTokensByFilter(function (token) {
            return token.line === current.line;
          });
          const boundaryStart =
            file.getPreviousTokenByType(current, utils.htmlTagBoundaryTypes) ||
            currentLineTokens[0];
          const boundaryStartIndex = boundaryStart._index;
          const boundaryEnd = file.getNextTokenByType(
            current,
            utils.htmlTagBoundaryTypes
          );
          const boundaryEndIndex = boundaryEnd._index;

          file.iterateTokensByFilter(
            function (token) {
              return (
                ['class', 'id'].includes(token.type) &&
                token._index >= boundaryStartIndex &&
                token._index <= boundaryEndIndex
              );
            },
            function () {
              errors.add('Unnecessary `div` tag', current.line, current.col);
            }
          );
        }
      );
    }
  }
};
