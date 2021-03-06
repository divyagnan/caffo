#! /usr/bin/env node
const prompts = require("prompts");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const Handlebars = require("handlebars");

const {
  templatePathHelper,
  templateFilePathHelper,
  getTemplateDirectoriesAndFiles,
  VariableScanner
} = require("./utils");

const cwd = process.cwd();

// start!
function start() {
  // check if the templates directory exists
  if (fs.existsSync(path.join(cwd, "/templates"))) {
    // get the directories or files in the templates directory
    const dirAndFiles = getTemplateDirectoriesAndFiles();
    // it exists so kick off the questioning process
    whichTemplateToUse(dirAndFiles);
  } else {
    console.log(
      "No 'templates' directory was found. Please make sure that exists and try again!"
    );
  }
}

// ask the user which templates they want to use
async function whichTemplateToUse(dirAndFiles) {
  const answer = await prompts({
    type: "select",
    name: "templateToUse",
    message: "Which template would you like to use?",
    choices: [...dirAndFiles.dirs, ...dirAndFiles.files],
    initial: 1
  });

  openTemplate(answer.templateToUse);
}

// open the file(s) that the user aksed for
function openTemplate(template) {
  let templateContents;
  // check if the template is a file or a directory
  if (fs.lstatSync(templatePathHelper(template)).isDirectory()) {
    // read every file in the directory
    const fileNames = fs.readdirSync(templatePathHelper(template));
    templateContents = fileNames.map(fileName => ({
      name: fileName,
      content: fs.readFileSync(
        templateFilePathHelper(template, fileName),
        "utf8"
      )
    }));
  } else {
    templateContents = [
      {
        name: template,
        content: fs.readFileSync(templatePathHelper(template), "utf8")
      }
    ];
  }
  // now that we have all of the files and their contents, extract the variables from the file
  getVariables(templateContents);
}

// get the variables in the file(s) the user asked for so we can then ask the user to fill them in
function getVariables(files) {
  // get the variables from the provided template
  const scanner = new VariableScanner();
  // map over the files and scan them for variables
  files.map(file => {
    const ast = Handlebars.parse(file.content);
    scanner.accept(ast);
  });

  compileFiles([...scanner.variables], files);
}

// ask the user to fill in the variables and then compile the files with answers they provided
async function compileFiles(variables, files) {
  // ask the user to fill in all of the variables
  // generate questions
  const questions = variables.map(variable => ({
    type: "text",
    name: variable,
    message: `What should the {{${variable}}} variable be replaced with?`
  }));

  const answers = await prompts(questions);

  // map through the files and compile each file providing the variable answers
  const compiledFiles = files.map(file => {
    const template = Handlebars.compile(file.content);
    const filledTemplate = template(answers);

    return {
      name: file.name,
      content: filledTemplate
    };
  });

  // pass the compiled contents to be created
  createFiles(compiledFiles);
}

// write the file(s) out to the filesystem
async function createFiles(files) {
  // ask the user where they want to output the files
  const answer = await prompts({
    type: "text",
    name: "directoryToPlaceFiles",
    message: "In which directory should your new file(s) be placed?"
  });

  // look for the directory the user specified and either create it or use
  mkdirp(path.join(cwd, `/${answer.directoryToPlaceFiles}`), err => {
    if (err) {
      console.error(err);
    }
    // map over all of the files and place them in their new home!
    files.map(file => {
      fs.writeFileSync(
        path.join(cwd, `/${answer.directoryToPlaceFiles}/${file.name}`),
        file.content
      );
    });
  });

  // let the user know everything is complete
  console.log(
    `
        All done! 
        Your new files should be /${answer.directoryToPlaceFiles}
        The following files were created ${files.map(file => file.name)}`
  );
}

// kick off the cli!
start();

module.exports = start;
