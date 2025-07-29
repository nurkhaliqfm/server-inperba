import { PrismaClient, StatusPerkara } from '@prisma/client';

const prisma = new PrismaClient();

const kontakList = [
  '6281241285382',
  '6281586589155',
  '6281283377702',
  '6287777140370',
];

const firstNames = ['Andi', 'Budi', 'Citra', 'Dewi'];
const lastNames = [
  'Wijaya',
  'Saputra',
  'Nugroho',
  'Putri',
  'Pratama',
  'Santoso',
];

function getRandomLongName(): string {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last1 = lastNames[Math.floor(Math.random() * lastNames.length)];
  const last2 = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last1} ${last2}`;
}
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const generateDummy = (kontak_wa: string, index: number) => {
  const tanggalReg = randomDate(new Date('2025-07-01'), new Date('2025-07-20'));

  return {
    kontak_wa,
    jenis_perkara: 'Lain-Lain',
    pembading: getRandomLongName(),
    terbanding: getRandomLongName(),
    nomor_perkara: `${index + 1}/G/2025/PTUN.MKS`,
    tanggal_registrasi: tanggalReg,
    status_penetapan_majelis: true,
    tanggal_penetapan_majelis: tanggalReg,
    status_penunjukan_panitera: true,
    tanggal_penunjukan_panitera: tanggalReg,
    status_penetapan_sidang: true,
    tanggal_penetapan_sidang: tanggalReg,
    status_hari_sidang: true,
    tanggal_hari_sidang: randomDate(
      new Date('2025-08-20'),
      new Date('2025-08-31'),
    ),
    status_proses: StatusPerkara.PROSES,
  };
};

async function main() {
  for (let i = 0; i < kontakList.length; i++) {
    const kontak = kontakList[i];
    const dummy = generateDummy(kontak, i);

    await prisma.perkaraBanding.create({
      data: dummy,
    });
  }
}

main()
  .then(() => {
    console.log('✅ Data dummy perkara banding berhasil dibuat');
  })
  .catch((e) => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
