import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync(path.resolve('prisma/seed_150.ts'), 'utf-8');

// Parse RAW_DESTINATIONS
const destBlockRegex = /const RAW_DESTINATIONS = \s*\[([\s\S]*?)\];/;
const match = fileContent.match(destBlockRegex);

if (!match) {
  console.error("Could not find RAW_DESTINATIONS block!");
  process.exit(1);
}

const block = match[1];
const objectRegex = /\{([\s\S]*?)\}/g;
let objMatch;
const destinations: any[] = [];

while ((objMatch = objectRegex.exec(block)) !== null) {
  const content = objMatch[1];
  
  const getField = (name: string) => {
    const r = new RegExp(`${name}:\\s*['"](.*?)['"]`);
    const m = content.match(r);
    return m ? m[1] : '';
  };

  const city = getField('city');
  const country = getField('country');
  const continent = getField('continent');
  const image = getField('image');
  const category = getField('category');

  destinations.push({ city, country, continent, image, category });
}

fs.writeFileSync(path.resolve('all_cities.json'), JSON.stringify(destinations, null, 2));
console.log(`Saved ${destinations.length} cities to all_cities.json.`);
