export class PerkaraRequest {
  kontak_wa: string;
  nomor_perkara: string;
  tanggal_registrasi: Date;
  jenis_perkara: string;
  pembading: string;
  terbanding: string;
  tanggal_hari_sidang: Date | null;
  status_proses: string;
}
