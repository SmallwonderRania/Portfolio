import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const SP = process.argv[2];
const W = Number(process.argv[3] || 1440);
const H = Number(process.argv[4] || 900);
const tag = process.argv[5] || 'd';
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const errors = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('requestfailed', r => errors.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')));
page.on('response', r => { if (r.status() >= 400) errors.push('http ' + r.status() + ': ' + r.url()); });

await page.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));

// broken images
const broken = await page.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
console.log('broken images:', broken);
console.log('horizontal overflow:', await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));

for (const id of ['hero', 'projects', 'achievements', 'tools', 'contact']) {
  await page.evaluate(i => document.getElementById(i).scrollIntoView({ block: 'start' }), id);
  await new Promise(r => setTimeout(r, id === 'achievements' || id === 'tools' ? 3500 : 900));
  await page.screenshot({ path: path.join(SP, `${tag}-${id}.png`) });
}
// ---- post-scroll checks ----
console.log('broken after scroll:', await page.evaluate(() => [...document.images].filter(i => i.src && !i.src.endsWith('index.html') && (!i.complete || i.naturalWidth === 0)).map(i => i.src)));

// carousel: drag and see caption change
await page.evaluate(() => document.getElementById('achievements-carousel').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 2500));
const cap = () => page.evaluate(() => document.querySelector('.circular-carousel__title')?.textContent);
const before = await cap();
const box = await (await page.$('#achievements-carousel .circular-carousel')).boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 260, box.y + box.height / 2, { steps: 12 });
await page.mouse.up();
await new Promise(r => setTimeout(r, 1800));
console.log('carousel caption:', before, '->', await cap());

// dome: click a tile
await page.evaluate(() => document.getElementById('tech-dome').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 1500));
const tile = await page.$('#tech-dome .item__image');
const tb = await page.evaluate(() => { const els=[...document.querySelectorAll('#tech-dome .item__image')]; const c={x:innerWidth/2,y:innerHeight/2}; let best=null,bd=1e9; for(const e of els){const r=e.getBoundingClientRect(); if(r.width<40) continue; const d=Math.hypot(r.x+r.width/2-c.x,r.y+r.height/2-c.y); if(d<bd){bd=d;best=[r.x+r.width/2,r.y+r.height/2];}} return best; });
await page.mouse.click(tb[0], tb[1]);
await new Promise(r => setTimeout(r, 1200));
console.log('dome enlarged viewer:', await page.evaluate(() => !!document.querySelector('#tech-dome .enlarge, #tech-dome .sphere-root[data-enlarging], #tech-dome .viewer .enlarge')));
await page.screenshot({ path: path.join(SP, `${tag}-dome-open.png`) });

// form validation (no network call expected)
await page.evaluate(() => document.getElementById('contact').scrollIntoView());
let posted = false;
page.on('request', r => { if (r.url().includes('formsubmit.co')) posted = true; });
await page.click('.form-submit');
await new Promise(r => setTimeout(r, 400));
console.log('empty-submit status:', await page.$eval('#form-status', e => e.textContent), '| posted:', posted);

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
