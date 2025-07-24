export class BaseUser {
  fullname: string;
  email?: string;
}

export class BaseAnggota {
  nama: string;
  kontak: string;
  alamat: string;
  jenis_kelamin: 'L' | 'P';
}

export class User extends BaseUser {
  data: Mahasiswa | Dosen | Umum;
}

export class Mahasiswa extends BaseAnggota {
  nim: string;
  fakultas?: string;
  id_prodi: string;
  angkatan: string;
}

export class Dosen extends BaseAnggota {
  jabatan: string;
  kampus: string;
}

export class Umum extends BaseAnggota {
  instansi: string;
  nik: string;
}
