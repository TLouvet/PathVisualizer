/**
 * As Typescript would not add the .js extension on compile, this script does just that.
 * Recursively checks through the dist folder and subfolders,
 * Verifies the first lines of a file, stops at the first line that does not start with import
 * as import statements should be on top once compiled. 
 * Probably won't work anymore if you change tsconfig options for module compilation
 */

const fs = require('fs');
const basePath = "./dist/src";
const dir = fs.readdirSync(basePath);

/**
 * 
 * @param {string[]} dir 
 * @param {number} index
 * @param {string} path
 * @returns 
 */
function traverseFiles(dir, index = 0, path = basePath) {
  if (index === dir.length) return;

  if (dir[index].endsWith('.js')) {
    addExtensionToImports(dir[index], path);
  } else {
    const subdir = fs.readdirSync(path + "/" + dir[index]);
    traverseFiles(subdir, 0, path + "/" + dir[index]);
  }
  traverseFiles(dir, index + 1, path);
}

function addExtensionToImports(filename, path) {
  const file = fs.readFileSync(path + "/" + filename, 'utf-8');
  const lines = file.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import")) {
      lines[i] = lines[i].substring(0, lines[i].length - 2) + ".js';"
    } else {
      break;
    }
  }
  fs.writeFileSync(path + "/" + filename, lines.join('\n'));
}

traverseFiles(dir);