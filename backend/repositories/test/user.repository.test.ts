import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { UserRepository } from "../user.repository";
import { Sqlite } from "../../config/database";

const DB_TEST = "user_repository_test.sqlite";
let sqlite: Sqlite;
let repo: UserRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new UserRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("UserRepository", () => {
  test("should find a mahasiswa by username", () => {
    const result = repo.findByUsername("test.mahasiswa");

    expect(result).toBeNull();
  });

  test("should find a dosen by username", () => {
    const result = repo.findByUsername("test.dosen");

    expect(result).toBeNull();
  });

  test("should find an admin by username", () => {
    const result = repo.findByUsername("test.admin");

    expect(result).toBeNull();
  });

  test("should return null if user not found by username", () => {
    const result = repo.findByUsername("nonexistent.user");

    expect(result).toBeNull();
  });

  test("should find a mahasiswa by id and role", () => {
    const result = repo.findById(999, "mahasiswa");

    expect(result).toBeNull();
  });

  test("should find a dosen by id and role", () => {
    const result = repo.findById(999, "dosen");

    expect(result).toBeNull();
  });

  test("should find an admin by id and role", () => {
    const result = repo.findById(999, "admin");

    expect(result).toBeNull();
  });

  test("should return null if user not found by id and role", () => {
    const result = repo.findById(999, "mahasiswa");

    expect(result).toBeNull();
  });
});
