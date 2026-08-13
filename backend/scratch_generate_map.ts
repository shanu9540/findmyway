import fs from 'fs';
import path from 'path';

const citiesData = JSON.parse(fs.readFileSync(path.resolve('all_cities.json'), 'utf-8'));
const cities = citiesData.map((d: any) => `${d.city} (${d.country})`);
console.log(JSON.stringify(cities, null, 2));
