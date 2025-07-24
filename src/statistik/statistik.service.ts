import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  StatistikSummeryResponse,
  StatistikTransaksiResponse,
} from 'src/model/statistik.model';
import { TransaksiResponse } from 'src/model/transaksi.model';

@Injectable()
export class StatistikService {
  constructor(private prismaService: PrismaService) {}

  async statistik(): Promise<StatistikSummeryResponse> {
    const artikelJurnal = await this.prismaService.artikelJurnal.count();
    const ejurnal = await this.prismaService.ejurnal.count();
    const ebook = await this.prismaService.ebook.count();
    const buku = await this.prismaService.buku.count();
    const skripsi = await this.prismaService.skripsi.count();
    const mahasiswa = await this.prismaService.mahasiswa.count();
    const dosen = await this.prismaService.dosen.count();
    const umum = await this.prismaService.umum.count();
    const transaksi = await this.prismaService.transaksi.count({
      where: {
        status: 'BORROWED',
      },
    });

    return {
      repository: {
        artikel_jurnal: {
          title: 'Artikel Jurnal',
          total: artikelJurnal,
        },
        ejurnal: {
          title: 'E-Jurnal',
          total: ejurnal,
        },
        buku: {
          title: 'Buku',
          total: buku,
        },
        ebook: {
          title: 'E-Book',
          total: ebook,
        },
        skripsi: {
          title: 'Skripsi',
          total: skripsi,
        },
      },
      anggota: {
        title: 'Anggota',
        total: umum + dosen + mahasiswa,
      },
      pinjaman: {
        title: 'Pinjaman',
        total: transaksi,
      },
    };
  }

  async transaksi(): Promise<StatistikTransaksiResponse[]> {
    const currentYear = new Date().getFullYear();
    const transaksi = await this.prismaService.transaksi.findMany({
      where: {
        borrowedAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
      select: {
        status: true,
        borrowedAt: true,
      },
    });

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const monthlyTransaksi = Array(12).fill(0);

    transaksi.forEach((t) => {
      const month = t.borrowedAt.getMonth();
      monthlyTransaksi[month]++;
    });

    const currentMonth = new Date().getMonth();
    const startMonth = Math.max(0, currentMonth - 5);

    const data = monthlyTransaksi
      .slice(startMonth, currentMonth + 1)
      .map((total, index) => ({
        month: months[startMonth + index],
        peminjaman: total,
      }));

    return data;
  }

  async latestTransaksi(): Promise<TransaksiResponse[]> {
    const transaksi = await this.prismaService.transaksi.findMany({
      where: {
        status: 'BORROWED',
      },
      select: {
        id: true,
        borrowedAt: true,
        returnedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            fullname: true,
            id_role: true,
          },
        },
        repository: {
          select: {
            id: true,
            judul: true,
            type: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });

    const today = new Date();
    const data = transaksi
      .map((t) => {
        const returnedAt = new Date(t.returnedAt!);
        const diffMs = today.getTime() - returnedAt.getTime();
        const overdueDays = Math.max(
          Math.floor(diffMs / (1000 * 60 * 60 * 24)),
          0,
        );

        return {
          ...t,
          overdue_days: overdueDays,
          denda: overdueDays * 2000,
        };
      })
      .filter((t) => t.overdue_days > 0);

    const sortByOverdueDays = data.sort(
      (a, b) => b.overdue_days - a.overdue_days,
    );

    return sortByOverdueDays.slice(0, 6);
  }

  async visitor() {
    const currentYear = new Date().getFullYear();

    const visitors = await this.prismaService.visitor.groupBy({
      by: ['date'],
      _count: {
        id: true,
      },
      where: {
        date: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const monthlyVisitorCount = Array(12).fill(0);

    visitors.forEach((visitor) => {
      const month = new Date(visitor.date).getMonth();
      monthlyVisitorCount[month] += visitor._count.id;
    });

    const currentMonth = new Date().getMonth();
    const startMonth = Math.max(0, currentMonth - 5);

    const data = monthlyVisitorCount
      .slice(startMonth, currentMonth + 1)
      .map((total, index) => ({
        month: months[startMonth + index],
        visitor: total,
      }));

    return data;
  }
}
