#!/usr/bin/env node
// Validates public/WEBSITES.md entries on every PR.
// Checks: field count, non-empty name/url, https:// prefix, no duplicate URLs.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/WEBSITES.md');

if (!fs.existsSync(filePath)) {
  console.error('❌ public/WEBSITES.md not found.');
  process.exit(1);
}

const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
const errors = [];
const urls = new Map(); // url -> line number

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  const lineNum = i + 1;

  if (!trimmed || trimmed.startsWith('#')) continue;

  const parts = trimmed.split('|').map((p) => p.trim());

  if (parts.length < 4) {
    errors.push(`Line ${lineNum}: Expected at least 4 pipe-separated fields, got ${parts.length}.`);
    continue;
  }

  const [name, url, owner, workTitle] = parts;

  if (!name) errors.push(`Line ${lineNum}: Website Name is empty.`);
  if (!url)  errors.push(`Line ${lineNum}: Website URL is empty.`);
  if (!owner) errors.push(`Line ${lineNum}: Owner is empty.`);
  if (!workTitle) errors.push(`Line ${lineNum}: Work Title is empty.`);

  if (url && !url.startsWith('https://')) {
    errors.push(`Line ${lineNum}: URL must start with https:// — got "${url}".`);
  }

  if (url) {
    if (urls.has(url)) {
      errors.push(`Line ${lineNum}: Duplicate URL "${url}" (first seen on line ${urls.get(url)}).`);
    } else {
      urls.set(url, lineNum);
    }
  }

  if (parts[4]) {
    const src = parts[4];
    if (src && !src.startsWith('https://')) {
      errors.push(`Line ${lineNum}: Source Code link must start with https:// — got "${src}".`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Validation failed with ${errors.length} error(s):\n`);
  errors.forEach((e) => console.error(`  • ${e}`));
  process.exit(1);
} else {
  console.log(`✅ All ${urls.size} entries are valid.`);
}
