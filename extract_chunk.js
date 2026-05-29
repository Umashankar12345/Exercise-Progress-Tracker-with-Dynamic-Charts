import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../Frontend/tracker-ui/dist/assets/index-CVrZGChq.js');
if (!fs.existsSync(filePath)) {
  console.log("File not found:", filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
console.log("Total lines:", lines.length);

const searchTerms = ['.icon', 'badge.icon', 'achievement.icon', 'ach.icon', 'r.icon', 'item.icon'];

searchTerms.forEach(term => {
  let index = 0;
  console.log(`\n--- Matches for "${term}" ---`);
  while (true) {
    index = content.indexOf(term, index);
    if (index === -1) break;
    
    const start = Math.max(0, index - 80);
    const end = Math.min(content.length, index + 80);
    console.log(`Pos ${index}: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
    
    index += term.length;
  }
});
