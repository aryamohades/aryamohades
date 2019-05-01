const UglifyJS = require('uglify-js');

module.exports = js =>
  UglifyJS.minify(js, {
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
    },
  }).code;
