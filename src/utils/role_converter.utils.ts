export function roleConverter(role: number): string {
  switch (role) {
    case 1:
      return 'SUPERADMIN';
    case 2:
      return 'MAHASISWA';
    case 3:
      return 'UMUM';
    case 4:
      return 'DOSEN';
    default:
      return 'UNKNOWN';
  }
}
