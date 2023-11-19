# Markdown Compiler

This is a simple node.js script that compiles a markdown file to HTML. It uses the [UnifiedJS](https://unifiedjs.com/)
framework along with the [reMark](https://unifiedjs.com/explore/package/remark/) and [reHype](https://unifiedjs.com/explore/package/rehype/)
packages to do some further processing.

Essentially, reMark is for working with Markdown in the Unified framework and in this program is just used to parse the 
Markdown input, while reHype is for working with HTML. After parsing the markdown we convert from the reMark format to the
reHype format and then use reHype to do some processing and formatting before outputing the HTML.


## Installation

This script is meant to be used with node.js and is dependent on the npm packages mentioned above.

These steps assume that you already have node.js and npm installed.

**Step 1:** Clone the repo.

```console
git clone <your-build-directory>
```

**Step 2:** Create a new npm project in the cloned folder.

```console
cd <your-build-directory>
npm init -y
```

**Step 3:** Change the project type to "module" by adding the "type" property to the package.json file:

```
--- a/package.json
+++ b/package.json
@@ -2,6 +2,7 @@
   "name": "example",
   "version": "1.0.0",
   "description": "",
+  "type": "module",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
```

**Step 4:** Install the required npm packages.

```console
npm install unified remark-parse remark-rehype rehype-stringify rehype-format remark-gfm remark-raw rehype-prism-plus
```

**Step 5:** Call the script and pass a markdown file as an argument:

```console
node ./transpile.js ./input.md
```

