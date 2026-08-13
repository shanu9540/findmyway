const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Prisma schema not found at: ${schemaPath}`);
  process.exit(0);
}

let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('🔌 [Prisma Setup] PostgreSQL Connection string detected.');
  // Change provider to postgresql if it was sqlite
  if (schemaContent.includes('provider = "sqlite"')) {
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log('✅ [Prisma Setup] Switched datasource provider to "postgresql".');
  } else {
    console.log('ℹ️ [Prisma Setup] Provider is already configured for "postgresql".');
  }
} else {
  console.log('🔌 [Prisma Setup] SQLite / File path Connection string detected.');
  // Change provider to sqlite if it was postgresql
  if (schemaContent.includes('provider = "postgresql"')) {
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log('✅ [Prisma Setup] Switched datasource provider to "sqlite".');
  } else {
    console.log('ℹ️ [Prisma Setup] Provider is already configured for "sqlite".');
  }
}
