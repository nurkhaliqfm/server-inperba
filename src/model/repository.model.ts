export class BaseRepository {
  judul: string;
  pengarang: string;
  nama_sampul?: string;
  nama_file?: string;
  type: 'EJURNAL' | 'JURNAL' | 'EBOOK' | 'BUKU' | 'SKRIPSI';
}

export class Repository extends BaseRepository {
  data: Ejurnal | Jurnal | Ebook | Buku | Skripsi;
}

export class Ejurnal {
  abstrak?: string;
  // pengarang: string;
  penerbit?: string;
  jurnal?: string;
  tahun_terbit: number;
  isbn?: string;
}

export class Jurnal {
  abstrak?: string;
  // pengarang: string;
  penerbit?: string;
  jurnal?: string;
  tahun_terbit: number;
  isbn?: string;
  id_lokasi: number;
}

export class Ebook {
  // pengarang: string;
  sinopsis?: string;
  cetakan?: string;
  penerbit: string;
  tempat_terbit?: string;
  tahun_terbit: number;
  isbn?: string;
}

export class Buku {
  tanggal?: string;
  no_regist?: string;
  // pengarang: string;
  sinopsis?: string;
  cetakan?: string;
  penerbit: string;
  tempat_terbit?: string;
  tahun_terbit: number;
  asal_buku?: string;
  isbn?: string;
  no_klasifikasi?: string;
  harga: number;
  jumlah_buku: number;
  keterangan?: string;
  id_lokasi: number;
}

export class Skripsi {
  abstrak?: string;
  // pengarang: string;
  fakultas?: string;
  tahun_terbit: number;
  id_lokasi: number;
  id_prodi: number;
}
