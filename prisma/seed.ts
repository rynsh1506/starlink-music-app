import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.artist.deleteMany();
}

const artists = [
  {
    ArtistName: 'Ed Sheeran',
    PackagesName: 'Photograph',
    SampleURL:
      'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/win.ogg',
  },
  {
    ArtistName: 'Ariana Grande',
    PackagesName: 'Problem (feat. Iggy Azalea)',
    SampleURL:
      'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg',
  },
  {
    ArtistName: 'Drake',
    PackagesName: 'Hotline Bling',
    SampleURL:
      'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg',
  },
];

async function main() {
  console.log('Resetting Database');
  await clearDatabase();
  console.log('Database succesfully reset');
  console.log('Seeding...');

  console.log('Create Artists...');
  for (const artist of artists) {
    await prisma.artist.create({
      data: {
        ArtistName: artist.ArtistName,
        PackageName: artist.PackagesName,
        ImageURL: '1700750054559f1dd642.jpeg',
        SampleURL: artist.SampleURL,
        ReleaseDate: new Date(),
      },
    });
  }

  console.log('Seeder completed!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
