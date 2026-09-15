// Regression checks for the intentionally homepage-only publication.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
const root = resolve(process.argv[2] || 'public');
const walk = dir => readdirSync(dir, { withFileTypes:true }).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]);
assert.deepEqual(walk(root).filter(f=>f.endsWith('.html')).map(f=>relative(root,f)).sort(), ['404.html','index.html']);
const html = readFileSync(join(root,'index.html'),'utf8');
assert(!/data-object-list|data-object-description|game-object-guide/.test(html),'Objects are inspected only inside the game');
assert(!/Esplora senza giocare|data-collect=|game-alternative/.test(html),'No external terminal controls');
const attr = (tag, key) => tag.match(new RegExp(`\\b${key}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`))?.slice(1).find(v=>v!==undefined);
const ids = [...html.matchAll(/<[^!][^>]*>/g)].map(m=>attr(m[0],'id')).filter(Boolean);
assert.equal(ids.length,new Set(ids).size,'IDs must be unique, including SVG defs.');
const expected = ['tuurbo','seotesteronline','software','backend','devops','stampa-3d'];
assert.deepEqual(ids.filter(id=>expected.includes(id)),expected);
assert.equal((html.match(/class=["']?work-section/g)||[]).length,6);
assert.equal((html.match(/class=["']?pixel-scene/g)||[]).length,6);
assert.deepEqual([...html.matchAll(/data-direction=(?:"([^"]*)"|([^\s>]+))/g)].map(m=>m[1]||m[2]).filter(x=>['left','right'].includes(x)).slice(-3),['right','left','right']);
for (const match of html.matchAll(/<(?:a|use)\b[^>]*>/g)) {
  const href = attr(match[0],'href');
  if (/^\/?#/.test(href||'')) assert(ids.includes(href.split('#')[1]),`Missing anchor ${href}`);
  assert(!/^\/(posts|projects|about|contact|changelog|elements)(\/|$)/.test(href||''),`Retired navigation: ${href}`);
}
const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,1,'Only home belongs in sitemap');
const data=JSON.parse(readFileSync(new URL('../data/portfolio.json',import.meta.url),'utf8'));
assert(data.experiences.every(e=>Array.isArray(e.achievements)));
const technologies=data.technologies.flatMap(row=>row.items.map(item=>item.name));
const normalized=technologies.map(name=>name.toLowerCase().replace(/^rest api$/, 'rest'));
assert.equal(normalized.length,new Set(normalized).size,'Technology names must be unique across all rows');
assert.deepEqual(data.technologies.map(row=>row.items.length),[55,18,38]);
assert.deepEqual(data.technologies.map(row=>row.items.slice(0,3).map(item=>item.name)),[
  ['Cloudflare Durable Objects','Cloudflare Queues','Cloudflare Workers KV'],
  ['Cloudflare Workers AI','Edge Functions','Edge Computing'],
  ['CAN Bus','Modbus','Zigbee2MQTT']
],'Specialist technologies lead each row');
for(const name of technologies) assert(html.includes(name),`Missing technology ${name}`);
assert(!html.includes('Inventario in allestimento'),'Remove the populated inventory placeholder');
assert(data.technologies[2].items.some(item=>item.name==='JetBrains' && item.note));
assert.deepEqual(data.experiences.map(e=>e.company),['Tuurbo.ai','SEO Tester Online','BreathPod','WashOut','Loom Social','Hostess.it','StudentFlat']);
assert.equal((html.match(/class=["']?experience-details/g)||[]).length,7);
assert(!/<details\b[^>]*class=["']?experience-details/.test(html),'Experiences must always be expanded');
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const e of data.experiences) {
  assert(html.includes(escape(e.company)));
  assert.equal(e.achievements.length,3);
  for(const text of [...e.achievements,...e.technologies]) assert(html.includes(escape(text)),`Missing experience detail: ${text}`);
  if(e.organization) assert(html.includes(escape(e.organization)));
}
console.log('PASS: homepage-only output, six scenes, three technology rows, anchors, sitemap and seven fully expanded experiences.');
