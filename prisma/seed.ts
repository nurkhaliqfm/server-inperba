import { PrismaClient, StatusPerkara } from '@prisma/client';

const prisma = new PrismaClient();

const kontakList = ['6281241285382', '6281283377702'];

const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const generateDummy = (kontak_wa: string, index: number) => {
  const tanggalReg = randomDate(new Date('2025-07-01'), new Date('2025-07-20'));

  return {
    kontak_wa,
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
  for (let i = 0; i < 10; i++) {
    const kontak = kontakList[i < 5 ? 0 : 1];
    const dummy = generateDummy(kontak, i);

    await prisma.perkaraBanding.create({
      data: dummy,
    });
  }
}

main()
  .then(() => {
    console.log('✅ 10 dummy perkara banding berhasil dibuat');
  })
  .catch((e) => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
