const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const Handlebars = require("handlebars");
const {
  getTemplateDirectoriesAndFiles,
  VariableScanner,
  templateFilePathHelper
} = require("../utils");

test("properly gets template directories and files", () => {
  const testVal = getTemplateDirectoriesAndFiles();

  const expectedVal = {
    dirs: [{ title: "connectedComponent", value: "connectedComponent" }],
    files: [{ title: "reactTemplate.js", value: "reactTemplate.js" }]
  };

  expect(testVal).toEqual(expectedVal);
});

test("properly gets variables from a handlebars template", () => {
  const fakeFile = `
    {{varOne}} {{varTwo}} {{varThree}} 
    {{varOne}} {{varTwo}} {{varThree}}
  `;
  const scanner = new VariableScanner();
  const ast = Handlebars.parse(fakeFile);
  scanner.accept(ast);

  const expectedVal = ["varOne", "varTwo", "varThree"];

  expect([...scanner.variables]).toEqual(expectedVal);
});

// test("e2e", () => {
//   // inject values for testing
//   prompts.inject({
//     templateToUse: "connectedComponent",
//     componentName: "testComponent",
//     lib: "testLib",
//     rootClass: "testClass",
//     directoryToPlaceFiles: "tests/testOutputFolder"
//   });

//   start();

//   setTimeout(() => {
//     // get the files from the expected directory
//     const fileNames = fs.readdirSync(
//       path.join(process.cwd(), "/tests/testOutputFolder")
//     );

//     const fileContents = fileNames.map(fileName => ({
//       name: fileName,
//       content: fs.readFileSync(
//         path.join(process.cwd(), `/tests/testOutputFolder/${fileName}`),
//         "utf8"
//       )
//     }));

//     expect(fileContents).toMatchSnapshot();
//   }, 5000);
// });
