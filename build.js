const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('Building portfolio for production deployment...');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Copy root static files (index.html, styles.css, script.js) to dist/
const rootFiles = ['index.html', 'styles.css', 'script.js'];
rootFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> dist/${file}`);
  }
});

// 2. Recursive folder copy helper
function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    const stat = fs.lstatSync(fromPath);
    if (stat.isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    }
  });
}

// 3. Copy assets folder to dist/assets
const assetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
copyFolderSync(assetsDir, distAssetsDir);
console.log('Copied assets/ -> dist/assets/');

// 4. In index.html, dist/widgets.js and dist/widgets.css are referenced as:
//    <link rel="stylesheet" href="dist/widgets.css">
//    <script src="dist/widgets.js" defer></script>
// When dist/ is served as the website root, a request for "dist/widgets.js" resolves to dist/dist/widgets.js.
// Also keep them at dist/widgets.js for direct access.
const nestedDistDir = path.join(distDir, 'dist');
if (!fs.existsSync(nestedDistDir)) {
  fs.mkdirSync(nestedDistDir, { recursive: true });
}

const widgetFiles = ['widgets.js', 'widgets.css'];
widgetFiles.forEach(file => {
  const rootDistFile = path.join(rootDir, 'dist', file);
  if (fs.existsSync(rootDistFile)) {
    fs.copyFileSync(rootDistFile, path.join(nestedDistDir, file));
    console.log(`Copied ${file} -> dist/dist/${file}`);
  }
});

console.log('Build completed successfully! Output ready in dist/');
