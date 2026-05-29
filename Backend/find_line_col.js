import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../Frontend/tracker-ui/dist/assets/index-CVrZGChq.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Total lines:", lines.length);

lines.forEach((line, idx) => {
  if (line.length > 1000) {
    // If this line contains matches or is long
    const pos = line.indexOf('.icon');
    if (pos !== -1) {
      console.log(`Line ${idx + 1} contains '.icon' at index ${pos}`);
    }
  }
});

// Look up column 161725 in the longest line (or check which lines are longer than 160000 characters)
lines.forEach((line, idx) => {
  if (line.length > 160000) {
    console.log(`Line ${idx + 1} is long (${line.length} chars)`);
    if (line.length > 161725) {
      const chunk = line.substring(161725 - 100, 161725 + 100);
      console.log(`Snippet around col 161725 on Line ${idx + 1}:`);
      console.log(`... ${chunk} ...`);
    }
  }
});
