import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypePrism from 'rehype-prism-plus';
import fs from 'fs';

var args = process.argv;
//var inputPath = args.length > 2 ? args[2] : "";
//var outputPath = args.length > 3 ? args[3] : "";

function parseMarkdown(markdownContent) {
  return new Promise(async function(resolve) {
    console.log("parsing markdown");
    const parser = await unified()
      .use(remarkParse)                                  //Parse Markdown
      .use(remarkGfm)                                    //GFM support (tables, autolists, tasklists/checkmark lists, strikethrough)
      .use(remarkRehype, {allowDangerousHtml: true})     //Convert to HTML
      .use(rehypeRaw)                                    //pass html tags through as-is
      .use(rehypePrism)                                  //Apply tags and class to code elements to allow styling later
      .use(rehypeFormat)                                 //Format whitespace in HTML
      .use(rehypeStringify)
      .process(markdownContent);
    console.log("Done parsing markdown");
    resolve(String(parser));
  });
}

function printOutput(data, outFile) {
      if (outFile === "") {
        console.log("Writing output to the screen");
        console.log(data);
      } else {
        console.log("Writing the output to " + outFile);
        fs.writeFile(outFile, data,{flag: 'w+'}, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
          }
        });
      }
}

async function processFile(inputFile, outputFile) {
    let HTMLOutput = await fs.promises.readFile(inputFile, 'utf8').then(parseMarkdown);
    printOutput(HTMLOutput, outputFile);
}
// MAIN SCRIPT

function printErrorMessage() {
  console.log ("Usage:");
  console.log("node transpile.js inputFile.md");
  console.log("node transpile.js inputFile.md outputFile.html");
  console.log("node transpile.js inputFile.md [inputFile.md [-o outputFile.html]]");
}

function isMdFile(input) {
    return (input.substring(input.length  - 4, input.length) === ".md");
}

function isHTMLFile(input) {
    return (input.substring(input.length  - 6, input.length) === ".html");
}
async function runScript() {
    if (args.length < 3) {
        printErrorMessage();
        return;
    } else {
        let counter = 2;
        let inputFile;
        let haveInputFile = false;
        let gettingOutputFile = false;
        do {
            if (!haveInputFile) {
                inputFile = args[counter];
                if (inputFile === "-o") {
                    printErrorMessage();
                    return;
                }
                haveInputFile = true;
            } else {
                if (!gettingOutputFile) {
                    if (args[counter] === "-o") {
                        counter++;
                        gettingOutputFile = true;
                        continue;
                    } else {
                        if (!isMdFile(inputFile)) {
                            printErrorMessage();
                            return;
                        }
                        let outputFile = inputFile.substring(0, inputFile.length - 4) + ".html";
                        await processFile(inputFile, outputFile);
                        inputFile = args[counter];
                    }
                } else {
                    let outputFile = args[counter];
                    if (!isHTMLFile(outputFile)) {
                        printErrorMessage();
                        return;
                    }
                    await processFile(inputFile, outputFile);
                    haveInputFile = false;
                    gettingOutputFile = false;
                }
            }
            counter++;
        } while (counter < args.length);
    }
}

runScript();