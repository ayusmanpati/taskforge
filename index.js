console.log("Hello Project -- Start of Backend Project !");
// package.json contains all the scripts and stuffs assigned....
// ....when we run npm init to initialize the project.

// In Node.js development, package.json is a crucial file that serves as the heart of any Node.js project.
// It acts as a manifest that defines the project’s metadata, dependencies, scripts, and more.

// In package.json, we can change the scripts{} part to assign....
// ....what it runs when we use "npm run dev" (the script name should be 'dev')

// We will use 'import' instead of 'require' -- to set we have to go to package.json....
// ....and change the "type" from "common.js" (which uses require) to "module" (uses import)

// Add prettier to the code using "npm install --save-dev --save-exact prettier"
// By far the biggest reason for adopting Prettier is to stop all the on-going debates over styles.
// It is generally accepted that having a common style guide is valuable for a project and team but getting there is a very painful and unrewarding process.
// Adding prettier solves this problem by implementing a common ground for (automatic) formatting.
// "npx prettier . --write" will format all files with prettier. "npx prettier . --check" to check all files.
// To change prettier's config for the project --> '.prettierrc' (lets the editor know that prettier is being used while also manually set values of formatting)....
// ....and '.prettierignore' (ignores files in this list).
