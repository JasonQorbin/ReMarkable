import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypePrism from 'rehype-prism-plus';
import fs from 'fs';

async function parseMarkdown(err, markdownContent) {
  if (err != null) {
    console.log('Error occurred');
    console.log(err);
    return;
  }

  console.log("parsing markdown");
  const parser = await unified()
    .use(remarkParse) //Parse Markdown
    .use(remarkGfm) //GFM support (tables, autolists, tasklists/checkmark lists, strikethrough)
    .use(remarkRehype, {allowDangerousHtml: true})//Convert to HTML
    .use(rehypeRaw) //pass html tags through as-is
    .use(rehypePrism)
    .use(rehypeFormat) //Format whitespace in HTML
    .use(rehypeStringify)
    .process(markdownContent);
    console.log(String(parser));
    // console.error(reporter(parser));
}

var args = process.argv;
var fileContents = fs.readFile(args[2], 'utf8', parseMarkdown);
