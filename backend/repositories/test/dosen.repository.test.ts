import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { DosenRepository } from "../dosen.repository";
import type { Dosen } from "../../models/dosen.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "dosen_repository_test.db";
let sqlite: Sqlite;
let repo: DosenRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new DosenRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("DosenRepository", () => {
  const dosenData: Omit<Dosen, "id" | "created_at" | "updated_at"> = {
    nip: "123456789",
    name: "Integration Test Dosen",
    username: "integration.test.dosen",
    password: "password",
  };
  let createdDosenId: number;

  test("should create a dosen", () => {
    createdDosenId = repo.create(dosenData) as number;

    const result = repo.findById(createdDosenId);
    expect(result).not.toBeNull();
    expect(result?.name).toBe(dosenData.name);
    expect(result?.username).toBe(dosenData.username);
  });

  test("should find by id", () => {
    const result = repo.findById(createdDosenId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdDosenId);
  });

  test("should find by username", () => {
    const result = repo.findByUsername(dosenData.username);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdDosenId);
  });

  test("should get all dosens", () => {
    const result = repo.all(1, 10);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdDosenId,
        name: dosenData.name,
      }),
    );
  });

  test("should update a dosen", () => {
    const updateData = { name: "Updated Integration Test Dosen" };

    repo.update(createdDosenId, updateData);

    const updatedResult = repo.findById(createdDosenId);
    expect(updatedResult?.name).toBe(updateData.name);
  });

  test("should delete a dosen", () => {
    const testData: Omit<Dosen, "id" | "created_at" | "updated_at"> = {
      ...dosenData,
      name: "Test Delete Dosen",
      username: "test.delete.dosen",
    };
    const testDosenId = repo.create(testData);

    expect(repo.findById(testDosenId)).not.toBeNull();

    repo.delete(testDosenId);

    const deletedDosen = repo.findById(testDosenId);
    expect(deletedDosen).toBeNull();
  });
});
