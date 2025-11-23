import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { MahasiswaRepository } from "../mahasiswa.repository";
import type { Mahasiswa } from "../../models/mahasiswa.model";
import { Sqlite } from "../../config/database";

const DB_TEST = "mahasiswa_repository_test.db";
let sqlite: Sqlite;
let repo: MahasiswaRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new MahasiswaRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("MahasiswaRepository", () => {
  const mahasiswaData: Omit<Mahasiswa, "id" | "created_at" | "updated_at"> = {
    major_id: 1,
    study_program_id: 1,
    nim: "123456789",
    name: "Integration Test Mahasiswa",
    email: "integration.test.mahasiswa@test.com",
    username: "integration.test.mahasiswa",
    password: "password",
  };

  test("should create a mahasiswa", () => {
    const uniqueData = {
      ...mahasiswaData,
      username: `integration.test.mahasiswa.${Date.now()}`,
      email: `integration.test.mahasiswa.${Date.now()}@test.com`,
      nim: `123456${Date.now().toString().slice(-3)}`,
    };

    const createdId = repo.create(uniqueData);

    const result = repo.findById(createdId);
    expect(result).not.toBeNull();
    expect(result?.name).toBe(uniqueData.name);
    expect(result?.username).toBe(uniqueData.username);
  });

  test("should get all mahasiswas", () => {
    const result = repo.all(1, 10);

    expect(Array.isArray(result)).toBe(true);
  });

  test("should find by id", () => {
    const uniqueData = {
      ...mahasiswaData,
      username: `test.find.by.id.${Date.now()}`,
      email: `test.find.by.id.${Date.now()}@test.com`,
      nim: `987654${Date.now().toString().slice(-3)}`,
    };

    const testId = repo.create(uniqueData);

    const result = repo.findById(testId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(testId);
  });

  test("should find by username", () => {
    const testUsername = `test.find.by.username.${Date.now()}`;
    const uniqueData = {
      ...mahasiswaData,
      username: testUsername,
      email: `test.find.by.username.${Date.now()}@test.com`,
      nim: `876543${Date.now().toString().slice(-3)}`,
    };

    const testId = repo.create(uniqueData);

    const result = repo.findByUsername(testUsername);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(testId);
  });

  test("should update a mahasiswa", () => {
    const uniqueData = {
      ...mahasiswaData,
      username: `test.update.mahasiswa.${Date.now()}`,
      email: `test.update.mahasiswa.${Date.now()}@test.com`,
      nim: `555666${Date.now().toString().slice(-3)}`,
    };
    const testId = repo.create(uniqueData);

    const updateData = { name: "Updated Integration Test Mahasiswa" };

    repo.update(testId, updateData);

    const updatedResult = repo.findById(testId);
    expect(updatedResult?.name).toBe(updateData.name);
  });

  test("should delete a mahasiswa", () => {
    const testData: Omit<Mahasiswa, "id" | "created_at" | "updated_at"> = {
      ...mahasiswaData,
      name: `Test Delete Mahasiswa ${Date.now()}`,
      username: `test.delete.mahasiswa.${Date.now()}`,
      email: `test.delete.mahasiswa.${Date.now()}@test.com`,
      nim: `111222${Date.now().toString().slice(-3)}`,
    };
    const testMahasiswaId = repo.create(testData);

    expect(repo.findById(testMahasiswaId)).not.toBeNull();

    repo.delete(testMahasiswaId);

    const result = repo.findById(testMahasiswaId);
    expect(result).toBeNull();
  });
});
