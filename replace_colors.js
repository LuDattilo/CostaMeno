const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const map = {
  'from-indigo-500 to-violet-600': 'from-autumn-4 to-autumn-2',
  'from-indigo-600 to-violet-600': 'from-autumn-4 to-autumn-5',
  'text-indigo-500': 'text-autumn-4',
  'text-indigo-600': 'text-autumn-5',
  'text-violet-600': 'text-autumn-4',
  'bg-indigo-50': 'bg-autumn-1/50',
  'border-indigo-400': 'border-autumn-4',
  'border-violet-400': 'border-autumn-2',
  'bg-violet-50': 'bg-autumn-1/30',
  'text-violet-700': 'text-autumn-5',
  'text-indigo-700': 'text-autumn-5',
  'ring-indigo-500/30': 'ring-autumn-4/30',
  'ring-indigo-400': 'ring-autumn-4',
  'shadow-indigo-500/20': 'shadow-autumn-5/20',
  'shadow-indigo-500/25': 'shadow-autumn-5/25',
  'accent-indigo-500': 'accent-autumn-4',
  'text-emerald-500': 'text-autumn-3',
  'bg-emerald-50': 'bg-autumn-3/10',
  'bg-teal-50': 'bg-autumn-1/40',
  'border-emerald-300': 'border-autumn-3',
  'text-emerald-800': 'text-autumn-5',
  'text-emerald-600': 'text-autumn-3',
  'bg-emerald-500': 'bg-autumn-3',
  'bg-emerald-400': 'bg-autumn-3/80',
  'bg-emerald-100': 'bg-autumn-3/30',
  'text-emerald-700': 'text-autumn-5',
  'text-amber-600': 'text-autumn-2',
  'bg-amber-50': 'bg-autumn-2/10',
  'border-amber-200': 'border-autumn-2/50',
  'text-amber-700': 'text-autumn-5',
  'bg-amber-100': 'bg-autumn-2/30',
  'bg-indigo-500': 'bg-autumn-4',
  'bg-violet-500': 'bg-autumn-2',
  'border-indigo-500': 'border-autumn-4',
  'border-violet-500': 'border-autumn-2',
  'hover:from-indigo-500': 'hover:from-autumn-4/90',
  'hover:to-violet-500': 'hover:to-autumn-5/90',
  '#dbeafe': '#f5ebd9',
  '#2563eb': '#BE2200',
  '#ede9fe': '#fff5eb',
  '#7c3aed': '#D9914C',
  "isBelow ? '#d1fae5' : '#fef3c7'": "isBelow ? '#e1efcd' : '#f5ebd9'",
  "isBelow ? '#059669' : '#d97706'": "isBelow ? '#B7AA7F' : '#D9914C'",
  "isCheapest ? '#10b981' : (isBelow ? '#3b82f6' : '#6366f1')": "isCheapest ? '#B7AA7F' : (isBelow ? '#D9914C' : '#BE2200')",
  "FUEL_COLORS = { 'Benzina': '#6366f1', 'Gasolio': '#f59e0b', 'GPL': '#10b981', 'Metano': '#3b82f6', 'GNL': '#8b5cf6' }": "FUEL_COLORS = { 'Benzina': '#BE2200', 'Gasolio': '#41060C', 'GPL': '#B7AA7F', 'Metano': '#D9914C', 'GNL': '#EBCBA6' }"
};

for (const [key, value] of Object.entries(map)) {
  content = content.split(key).join(value);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Colors replaced in App.jsx');
