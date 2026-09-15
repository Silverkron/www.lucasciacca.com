// Dependency-free checks against a fresh Hugo production build.
// Usage: node scripts/verify-site.mjs /absolute/path/to/generated/site
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(process.argv[2] || 'public');
assert(existsSync(join(root, 'index.html')), 'Build the site before checking it.');
const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(path, e.name)) : [join(path, e.name)]);
const pages = walk(root).filter(p => p.endsWith('.html'));
const errors = [];
const external = new Set();
const resources = new Set();
for (const file of pages) {
  const html = readFileSync(file, 'utf8').replace(/<pre\b[\s\S]*?<\/pre>/g, '');
  const page = relative(root, file);
  if (/http-equiv=["']?refresh/i.test(html)) continue;
  const h1 = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1 !== 1) errors.push(page + ': expected one H1, found ' + h1);
  if (page !== '404.html' && !/<link[^>]*rel=["']?canonical/.test(html)) errors.push(page + ': canonical missing');
  if (!/<meta[^>]*name=["']?description/.test(html)) errors.push(page + ': description missing');
  for (const match of html.matchAll(/\b(?:href|src|data-module)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const value = (match[1] ?? match[2] ?? match[3]).replaceAll('&amp;', '&');
    if (!value || /^(#|mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    let url;
    try { url = new URL(value, 'https://www.lucasciacca.com/' + page); } catch { continue; }
    if (!['www.lucasciacca.com', 'lucasciacca.com'].includes(url.hostname)) {
      external.add(url.hostname); continue;
    }
    let target = join(root, decodeURIComponent(url.pathname));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(page + ': missing ' + url.pathname);
    else if (!target.endsWith('.html')) resources.add(target);
  }
  for (const m of html.matchAll(/<script type=["']?application\/ld\+json["']?>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errors.push(page + ': invalid structured data'); }
  }
}
console.log(JSON.stringify({
  pages: pages.length,
  broken: [...new Set(errors)],
  externalHostsNotValidated: [...external].sort(),
  resources: [...resources].filter(p => /\.(js|css|woff2)$/.test(p)).map(p => ({ file: relative(root,p), bytes: statSync(p).size }))
}, null, 2));
process.exitCode = errors.length ? 1 : 0;
