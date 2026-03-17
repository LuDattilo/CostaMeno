import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove all gradients and replace with solid
content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-z0-9-\/]+\s+to-[a-z0-9-\/]+/g, 'bg-bloom-4');
content = content.replace(/hover:from-[a-z0-9-\/]+\s+hover:to-[a-z0-9-\/]+/g, 'hover:bg-bloom-4/90');
// specific text gradient fix
content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-bloom-4 to-bloom-5/g, 'text-bloom-4');
content = content.replace(/text-transparent bg-clip-text bg-bloom-4/g, 'text-bloom-4');

// 2. Replace autumn mappings
const autumnToBloom = {
  'autumn-1': 'bloom-1',
  'autumn-2': 'bloom-2',
  'autumn-3': 'bloom-3',
  'autumn-4': 'bloom-4',
  'autumn-5': 'bloom-5'
};
for (const [key, value] of Object.entries(autumnToBloom)) {
  content = content.split(key).join(value);
}

// 3. Fallbacks for missed colors (indigo, violet, emerald, teal, amber)
const oldToBloom = {
  'indigo-500': 'bloom-4',
  'indigo-600': 'bloom-4',
  'indigo-400': 'bloom-4',
  'indigo-700': 'bloom-5',
  'violet-600': 'bloom-4',
  'violet-500': 'bloom-2',
  'violet-400': 'bloom-2',
  'violet-700': 'bloom-5',
  'emerald-500': 'bloom-3',
  'emerald-600': 'bloom-3',
  'emerald-300': 'bloom-3',
  'emerald-400': 'bloom-3/80',
  'emerald-800': 'bloom-5',
  'emerald-700': 'bloom-5',
  'emerald-100': 'bloom-3/30',
  'emerald-50': 'bloom-3/10',
  'teal-50': 'bloom-3/10',
  'amber-600': 'bloom-2',
  'amber-700': 'bloom-5',
  'amber-200': 'bloom-2/50',
  'amber-100': 'bloom-2/30',
  'amber-50': 'bloom-2/10',
  'bg-slate-50': 'bg-bloom-1/50'
};
for (const [key, value] of Object.entries(oldToBloom)) {
  content = content.split(key).join(value);
}

// 4. Hex colors in logic
content = content.replace(/#BE2200/gi, '#8994bb'); // Benzina
content = content.replace(/#41060C/gi, '#4a5568'); // Gasolio
content = content.replace(/#B7AA7F/gi, '#7b9c7b'); // GPL
content = content.replace(/#D9914C/gi, '#ebb343'); // Metano
content = content.replace(/#EBCBA6/gi, '#e77399'); // GNL

// If it previously didn't replace hex properly
content = content.replace(/#6366f1/gi, '#8994bb');
content = content.replace(/#f59e0b/gi, '#4a5568');
content = content.replace(/#10b981/gi, '#7b9c7b');
content = content.replace(/#3b82f6/gi, '#ebb343');
content = content.replace(/#8b5cf6/gi, '#e77399');

// Specific text fixes
content = content.replace(/text-transparent bg-clip-text bg-bloom-4/g, 'text-bloom-4');

fs.writeFileSync('src/App.jsx', content);
console.log('Done mapping App.jsx colors to bloom');
