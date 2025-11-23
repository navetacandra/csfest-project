import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { FileRepository } from "../file.repository";
import type { File } from "../../models/file.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "file_repository_test.sqlite";
let sqlite: Sqlite;
let repo: FileRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new FileRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("FileRepository", () => {
  const fileData: Omit<File, "id" | "created_at" | "updated_at"> = {
    mahasiswa_id: 1,
    dosen_id: null,
    upload_name: "integration_test_file.pdf",
    random_name: "random_integration_test_string.pdf",
    size: 12345,
    mimetype: "application/pdf",
  };
  let createdFileId: number;

  test("should create a file record", () => {
    createdFileId = repo.create(fileData) as number;

    // Verifikasi bahwa data benar-benar ada di database dengan mengaksesnya kembali
    const result = repo.findById(createdFileId);
    expect(result).not.toBeNull();
    expect(result?.upload_name).toBe(fileData.upload_name);
    expect(result?.random_name).toBe(fileData.random_name);
  });

  test("should find by random name", () => {
    const result = repo.findByRandomName(fileData.random_name);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdFileId);
    expect(result?.random_name).toBe(fileData.random_name);
  });

  test("should delete a file record", () => {
    // Buat file baru untuk dihapus
    const testFileData: Omit<File, "id" | "created_at" | "updated_at"> = {
      ...fileData,
      upload_name: "test_delete_file.pdf",
      random_name: "delete_random_string.pdf",
    };
    const testFileId = repo.create(testFileData);

    // Pastikan file ada sebelum dihapus
    expect(repo.findById(testFileId)).not.toBeNull();

    repo.delete(testFileId);

    // Verifikasi bahwa file sudah dihapus
    const deletedFile = repo.findById(testFileId);
    expect(deletedFile).toBeNull();
  });
});
