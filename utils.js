// @flow
const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const Visitor = Handlebars.Visitor;

const cwd = process.cwd();
// helpers for getting items in the templates directory
const templatePathHelper = templateName =>
  path.join(cwd, `/templates/${templateName}`);

const templateFilePathHelper = (templateName, fileName) =>
  path.join(cwd, `/templates/${templateName}/${fileName}`);

/**
 * Get all of the file and directory names from the './templates/' folder
 */
function getTemplateDirectoriesAndFiles() {
  // get all directories or files
  const dirAndFiles = fs.readdirSync(path.join(cwd, "/templates")).reduce((
    prev,
    current
  ) => {
    if (fs.lstatSync(templatePathHelper(current)).isDirectory()) {
      prev.dirs.push({ title: current, value: current });
    } else if (fs.lstatSync(templatePathHelper(current)).isFile()) {
      prev.files.push({ title: current, value: current });
    }
    return prev;
  }, { dirs: [], files: [] });

  return dirAndFiles;
}

// HACK - this is a hack to get the variables from a handlebars template
class VariableScanner extends Visitor {
  constructor() {
    super();
    this.variables = new Set();
  }

  MustacheStatement(mus) {
    // map over the parts - but make sure to get rid of duplicates by using set
    mus.path.parts.map(m => this.variables.add(m));
  }
}

module.exports = {
  templatePathHelper,
  templateFilePathHelper,
  getTemplateDirectoriesAndFiles,
  VariableScanner
};
