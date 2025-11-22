export interface File {
  id: number;
  mahasiswa_id: number | null;
  dosen_id: number | null;
  upload_name: string;
  random_name: string;
  size: number;
  mimetype: string | null;
  created_at: string;
  updated_at: string;
}
