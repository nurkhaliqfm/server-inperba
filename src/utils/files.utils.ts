import * as path from 'path';
import * as fs from 'fs';

export const HandleFileDeletation = async (
  name: string | null,
  type: 'skripsi' | 'ejurnal' | 'jurnal' | 'ebook' | 'buku',
) => {
  if (!name) {
    return;
  }

  const fileReposPath = path.resolve(__dirname, `../../uploads/${type}`, name);

  if (fs.existsSync(fileReposPath)) {
    fs.unlinkSync(fileReposPath);
  }
};

export const HandleFileAction = async (
  repos: string,
  files: Express.Multer.File,
  olds: string | null,
  type: 'skripsi' | 'ejurnal' | 'jurnal' | 'ebook' | 'buku',
) => {
  if (olds) {
    if (!repos || !files) {
      return olds;
    }

    await HandleFileDeletation(olds, type);
  }

  if (!files) {
    return null;
  }

  const fileName = files[0].filename;

  return fileName;
};
