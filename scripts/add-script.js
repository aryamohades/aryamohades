const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const { BUILD_PATH, SCRIPTS_PATH } = require('./constants');

module.exports = (script, scriptsAdded) => {
  if (!scriptsAdded.has(script)) {
    scriptsAdded.add(script);
    fs.writeFileSync(
      path.join(BUILD_PATH, script),
      UglifyJS.minify(String(fs.readFileSync(path.join(SCRIPTS_PATH, script))), {
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
      }).code,
    );
  }
}
