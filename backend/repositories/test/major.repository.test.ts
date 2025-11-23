import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { MajorRepository } from "../major.repository";
import type { Major } from "../../models/major.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "major_repository_test.sqlite";
let sqlite: Sqlite;
let repo: MajorRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new MajorRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("MajorRepository", () => {
  const majorData: Omit<Major, "id" | "created_at" | "updated_at"> = {
    name: "Integration Test Major",
  };
  let createdMajorId: number;

  test("should create a major", () => {
    createdMajorId = repo.create(majorData) as number;

    // Verifikasi bahwa data benar-benar ada di database dengan mengaksesnya kembali
    const result = repo.findById(createdMajorId);
    expect(result).not.toBeNull();
    expect(result?.name).toBe(majorData.name);
  });

  test("should find by id", () => {
    const result = repo.findById(createdMajorId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdMajorId);
  });

  test("should update a major", () => {
    const updateData = { name: "Updated Integration Test Major" };

    repo.update(createdMajorId, updateData);

    const updatedResult = repo.findById(createdMajorId);
    expect(updatedResult?.name).toBe(updateData.name);
  });

  test("should delete a major", () => {
    // Buat major baru untuk dihapus
    const testData: Omit<Major, "id" | "created_at" | "updated_at"> = {
      name: "Test Delete Major",
    };
    const testMajorId = repo.create(testData);

    // Pastikan major ada sebelum dihapus
    expect(repo.findById(testMajorId)).not.toBeNull();

    repo.delete(testMajorId);

    // Verifikasi bahwa major sudah dihapus
    const deletedMajor = repo.findById(testMajorId);
    expect(deletedMajor).toBeNull();
  });
});
