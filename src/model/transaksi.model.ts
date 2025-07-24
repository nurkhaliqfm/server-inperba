export class TransaksiRequest {
  user: number;
  repos: number;
  type: 'EJURNAL' | 'JURNAL' | 'EBOOK' | 'BUKU' | 'SKRIPSI';
  status: 'BORROWED' | 'RETURNED' | 'LOST' | 'DAMAGED' | 'AVAILABLE';
  brrowedAt: Date | null;
  returnedAt: Date | null;
}

export class TransaksiResponse {
  id: number;
  user: {
    id: number;
    fullname: string;
  };
  repository: {
    id: number;
    judul: string;
    type: 'EJURNAL' | 'JURNAL' | 'EBOOK' | 'BUKU' | 'SKRIPSI';
  };
  status: 'BORROWED' | 'RETURNED' | 'LOST' | 'DAMAGED' | 'AVAILABLE';
  borrowedAt: Date | null;
  returnedAt: Date | null;
}
