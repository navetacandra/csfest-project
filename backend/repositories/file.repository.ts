import type { File } from "../models/file.model";
import type { Sqlite } from "../config/database";

type FileForCreate = Omit<File, "id" | "created_at" | "updated_at">;

export class FileRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  create(fileData: FileForCreate): number {
    const result = this.db.query(
      "INSERT INTO file (mahasiswa_id, dosen_id, upload_name, random_name, size, mimetype) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
      fileData.mahasiswa_id,
      fileData.dosen_id,
      fileData.upload_name,
      fileData.random_name,
      fileData.size,
      fileData.mimetype,
    );
    const firstResult = result[0] as { id: number | bigint };
    return firstResult.id as number;
  }

  findByRandomName(randomName: string): File | null {
    const result = this.db.query(
      "SELECT * FROM file WHERE random_name = ?",
      randomName,
    ) as File[];
    return result.length > 0 ? result[0]! : null;
  }

  findById(id: number): File | null {
    const result = this.db.query(
      "SELECT * FROM file WHERE id = ?",
      id,
    ) as File[];
    return result.length > 0 ? result[0]! : null;
  }

  delete(id: number): void {
    this.db.query("DELETE FROM file WHERE id = ?", id);
  }
}
