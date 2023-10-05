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
var inputPath = args.length > 2 ? args[2] : "";
var outputPath = args.length > 3 ? args[3] : "";

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

function printOutput(data) {
      if (outputPath === "") {
        console.log("Writing output to the screen");
        console.log(data);
      } else {
        console.log("Writing the output to " + outputPath);
        fs.writeFile(outputPath, data,{flag: 'w+'}, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
          }
        });
      }
}

// MAIN SCRIPT

if (inputPath === "" ) {
  console.log ("Please provide a markdown file as the first argument.");
} else {
  fs.promises.readFile(args[2], 'utf8')
    .then( parseMarkdown)
    .then( printOutput);
}
