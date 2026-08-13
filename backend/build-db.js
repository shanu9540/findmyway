const { execSync } = require('child_process');

const dbUrl = process.env.DATABASE_URL;
if (dbUrl && (dbUrl.startsWith('postgres') || dbUrl.startsWith('postgresql'))) {
  console.log('🔄 PostgreSQL Database detected. Pushing schema tables...');
  try {
    // Run schema push
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Prisma schema pushed successfully.');
    
    // Run database seeder to populate default packages, stays and cities
    console.log('🌱 Seeding database with cities, custom packages, and stays...');
    execSync('npx tsx replace_images_seeder.ts', { stdio: 'inherit' });
    console.log('✅ Seeding complete.');
  } catch (err) {
    console.error('❌ Database schema push or seeding failed:', err.message);
  }
} else {
  console.log('ℹ️ No PostgreSQL Database URL found. Skipping production schema sync.');
}
