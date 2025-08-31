import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function stripJsonc(src) {
  let out = '';
  let i = 0, n = src.length;
  let inStr = false, quote = null, esc = false;
  let inLine = false, inBlock = false;

  while (i < n) {
    const c = src[i], d = i + 1 < n ? src[i + 1] : '';
    if (inStr) {
      out += c;
      if (esc) { esc = false; }
      else if (c === '\\') { esc = true; }
      else if (c === quote) { inStr = false; quote = null; }
      i++;
      continue;
    }
    if (inLine) {
      if (c === '\n') { inLine = false; out += c; }
      i++;
      continue;
    }
    if (inBlock) {
      if (c === '*' && d === '/') { inBlock = false; i += 2; continue; }
      i++;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; quote = c; out += c; i++; continue; }
    if (c === '/' && d === '/') { inLine = true; i += 2; continue; }
    if (c === '/' && d === '*') { inBlock = true; i += 2; continue; }
    out += c; i++;
  }

  // remove trailing commas not inside strings
  let res = '';
  inStr = false; quote = null; esc = false;
  for (i = 0; i < out.length; i++) {
    const c = out[i];
    if (inStr) {
      res += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) { inStr = false; quote = null; }
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; quote = c; res += c; continue; }

    if (c === ',') {
      let j = i + 1;
      while (j < out.length && /\s/.test(out[j])) j++;
      if (j < out.length && (out[j] === '}' || out[j] === ']')) {
        // skip this comma
        continue;
      }
    }
    res += c;
  }

  return res;
}

function offsetToLineCol(text, offset) {
  let line = 1, col = 1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === '\n') { line++; col = 1; } else { col++; }
  }
  return `${line}:${col}`;
}

/**
 * Parses the wrangler.jsonc file and returns the configuration object
 * @returns {object}
 */
export function parseWranglerConfig() {
  const wranglerPath = path.join(__dirname, '..', '..', 'wrangler.jsonc');
  const text = fs.readFileSync(wranglerPath, 'utf8');
  const cleaned = stripJsonc(text);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const pos = e.message.match(/position (\d+)/)?.[1];
    const loc = pos ? offsetToLineCol(cleaned, Number(pos)) : '?:?';
    throw new Error(`Failed to parse wrangler.jsonc at ${loc}: ${e.message}`);
  }
}

/**
 * @returns {{ name: string, id: string } | null}
 */
export function getD1Database() {
  const config = parseWranglerConfig();
  const d1 = config.d1_databases?.[0];
  return d1 ? { name: d1.database_name, id: d1.database_id } : null;
}
