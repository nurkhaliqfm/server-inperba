export class StatistikSummeryResponse {
  repository: {
    buku: {
      title: string;
      total: number;
    };
    ebook: {
      title: string;
      total: number;
    };
    artikel_jurnal: {
      title: string;
      total: number;
    };
    ejurnal: {
      title: string;
      total: number;
    };
    skripsi: {
      title: string;
      total: number;
    };
  };
  anggota: {
    title: string;
    total: number;
  };
  pinjaman: {
    title: string;
    total: number;
  };
}

export class StatistikTransaksiResponse {
  month: string;
  peminjaman: number;
}
