import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../assets/projects');
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--allow-file-access-from-files']
});
const page = await browser.newPage();
await page.setViewport({ width: 1240, height: 900, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'covers.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const id of ['vibe', 'gully', 'resume', 'phish', 'gesture', 'culinary']) {
  const el = await page.$('#' + id);
  await el.screenshot({ path: path.join(out, id + '.jpg'), type: 'jpeg', quality: 88 });
  console.log('wrote', id);
}
await browser.close();
