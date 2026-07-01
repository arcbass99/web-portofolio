/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Basic background replacements
  content = content.replace(/bg-slate-50/g, 'bg-black');
  content = content.replace(/bg-\[\#0F172A\]/g, 'bg-black');
  
  // Containers
  content = content.replace(/bg-white/g, 'liquid-glass border border-white/5 bg-white/5');
  content = content.replace(/bg-slate-800/g, 'liquid-glass border border-white/5 bg-white/5');
  content = content.replace(/bg-slate-900/g, 'liquid-glass border border-white/5 bg-white/5');
  
  // Text colors
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-800/g, 'text-white/80');
  content = content.replace(/text-slate-700/g, 'text-white/80');
  content = content.replace(/text-slate-600/g, 'text-white/80');
  content = content.replace(/text-slate-500/g, 'text-white/60');
  content = content.replace(/text-slate-400/g, 'text-white/60');
  content = content.replace(/text-gray-900/g, 'text-white');
  content = content.replace(/text-gray-800/g, 'text-white/80');
  content = content.replace(/text-gray-500/g, 'text-white/60');
  
  // Borders
  content = content.replace(/border-slate-200/g, 'border-white/10');
  content = content.replace(/border-slate-300/g, 'border-white/10');
  content = content.replace(/border-slate-700/g, 'border-white/10');
  content = content.replace(/border-slate-800/g, 'border-white/10');
  content = content.replace(/border-gray-200/g, 'border-white/10');

  // Input styles (assuming typical Tailwind input classes)
  content = content.replace(/focus:border-blue-500/g, 'focus:border-cyan-400');
  content = content.replace(/focus:ring-blue-500/g, 'focus:ring-cyan-400');
  content = content.replace(/focus:border-indigo-500/g, 'focus:border-cyan-400');
  content = content.replace(/focus:ring-indigo-500/g, 'focus:ring-cyan-400');
  content = content.replace(/focus:ring-indigo-600/g, 'focus:ring-cyan-400');
  
  // Adjust inputs if they were white background
  content = content.replace(/liquid-glass border border-white\/5 bg-white\/5( \w+)* focus:ring/g, 'bg-white/5 border-white/10 text-white focus:border-cyan-400 focus:ring-cyan-400');
  
  fs.writeFileSync(filePath, content);
  console.log('Processed:', filePath);
}

const adminAppDir = path.join(__dirname, 'app', 'admin');
const adminCompDir = path.join(__dirname, 'components', 'admin');

processDir(adminAppDir);
processDir(adminCompDir);
