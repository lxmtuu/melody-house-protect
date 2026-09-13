const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.song.count();
  if (count === 0) {
    await prisma.song.createMany({
      data: [
        { title: 'River Flows In You', artist: 'Yiruma', difficulty: 'Easy' },
        { title: 'Für Elise', artist: 'Beethoven', difficulty: 'Medium' },
        { title: 'Nocturne Op. 9 No. 2', artist: 'Chopin', difficulty: 'Hard' }
      ]
    });
    console.log('✅ Seeded 3 default songs!');
  } else {
    console.log('✅ Database already seeded.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
