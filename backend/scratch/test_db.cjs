const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Test with standard client
const prisma = new PrismaClient();

// Test with absolute path resolution
const absolutePath = path.resolve(__dirname, '../prisma/dev.db');
const prismaAbs = new PrismaClient({
  datasources: {
    db: {
      url: `file:${absolutePath}`
    }
  }
});

async function main() {
  console.log('1. Testing standard Prisma Client...');
  try {
    const destinations = await prisma.destination.findMany({ take: 3 });
    console.log('✅ Standard query success! Count:', destinations.length);
  } catch (err) {
    console.log('❌ Standard query failed:', err.message);
  }

  console.log('\n2. Testing absolute path resolved Prisma Client...');
  try {
    const destinations = await prismaAbs.destination.findMany({ take: 3 });
    console.log('✅ Absolute path query success! Count:', destinations.length);
  } catch (err) {
    console.log('❌ Absolute path query failed:', err.message);
  }

  await prisma.$disconnect();
  await prismaAbs.$disconnect();
}

main();
