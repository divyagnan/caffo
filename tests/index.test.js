import test from "ava";
import mock from "mock-fs";
import Handlebars from "handlebars";
import { getTemplateDirectoriesAndFiles, VariableScanner } from "../utils";

test("properly gets template directories and files", t => {
  mock({
    templates: {
      "template.js": "",
      emptyTemplateDirectory: {}
    }
  });

  const testVal = getTemplateDirectoriesAndFiles();

  const expectedVal = {
    dirs: ["emptyTemplateDirectory"],
    files: ["template.js"]
  };

  t.deepEqual(testVal, expectedVal);

  mock.restore();
});

test("properly gets variables from a handlebars template", t => {
  const fakeFile = `
    {{varOne}} {{varTwo}} {{varThree}} 
    {{varOne}} {{varTwo}} {{varThree}}
  `;
  const scanner = new VariableScanner();
  const ast = Handlebars.parse(fakeFile);
  scanner.accept(ast);

  const expectedVal = ["varOne", "varTwo", "varThree"];

  t.deepEqual([...scanner.variables], expectedVal);
});
