import { sqlite } from "..";
import type { File } from "../models/file.model";

type FileForCreate = Omit<File, "id" | "created_at" | "updated_at">;

export class FileRepository {
  create(fileData: Omit<File, "id" | "created_at" | "updated_at">) {
    const result = sqlite.query(
      "INSERT INTO file (mahasiswa_id, dosen_id, upload_name, random_name, size, mimetype) VALUES ($mahasiswa_id, $dosen_id, $upload_name, $random_name, $size, $mimetype) RETURNING id",
      {
        $mahasiswa_id: fileData.mahasiswa_id,
        $dosen_id: fileData.dosen_id,
        $upload_name: fileData.upload_name,
        $random_name: fileData.random_name,
        $size: fileData.size,
        $mimetype: fileData.mimetype,
      },
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id;
  }

  findByRandomName(randomName: string) {
    const result = sqlite.query("SELECT * FROM file WHERE random_name = ?", [
      randomName,
    ]) as File[];
    return result.length > 0 ? result[0] : null;
  }

  delete(id: number) {
    sqlite.query("DELETE FROM file WHERE id = ?", [id]);
  }
}
