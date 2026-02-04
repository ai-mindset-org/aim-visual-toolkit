/**
 * Sync community metaphors from LMS submodule
 * Copies community.json and generated SVGs to public/metaphors/
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Source paths (LMS submodule)
const LMS_METAPHORS = join(ROOT, 'lms/public/metaphors');
const LMS_COMMUNITY_JSON = join(LMS_METAPHORS, 'community.json');
const LMS_GENERATED = join(LMS_METAPHORS, 'generated');

// Destination paths
const DEST_METAPHORS = join(ROOT, 'public/metaphors');
const DEST_COMMUNITY_JSON = join(DEST_METAPHORS, 'community.json');
const DEST_GENERATED = join(DEST_METAPHORS, 'generated');

console.log('🔄 Syncing community metaphors from LMS...');

// Check if LMS submodule exists
if (!existsSync(LMS_METAPHORS)) {
  console.log('⚠️  LMS submodule not found. Run: git submodule update --init');
  console.log('   Skipping community sync.');
  process.exit(0);
}

// Ensure destination directories exist
if (!existsSync(DEST_METAPHORS)) {
  mkdirSync(DEST_METAPHORS, { recursive: true });
}
if (!existsSync(DEST_GENERATED)) {
  mkdirSync(DEST_GENERATED, { recursive: true });
}

// Copy community.json
if (existsSync(LMS_COMMUNITY_JSON)) {
  copyFileSync(LMS_COMMUNITY_JSON, DEST_COMMUNITY_JSON);

  // Read to show count
  const data = JSON.parse(readFileSync(LMS_COMMUNITY_JSON, 'utf-8'));
  console.log(`✅ Copied community.json (${data.metaphors?.length || 0} metaphors)`);
} else {
  console.log('⚠️  community.json not found in LMS');
}

// Copy generated SVGs
if (existsSync(LMS_GENERATED)) {
  const svgFiles = readdirSync(LMS_GENERATED).filter(f => f.endsWith('.svg'));

  for (const file of svgFiles) {
    copyFileSync(
      join(LMS_GENERATED, file),
      join(DEST_GENERATED, file)
    );
  }

  console.log(`✅ Copied ${svgFiles.length} generated SVGs`);
} else {
  console.log('⚠️  generated/ folder not found in LMS');
}

console.log('✨ Community sync complete!');
