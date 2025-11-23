import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { ClassRepository } from "../class.repository";
import { Sqlite } from "../../config/database";

const DB_TEST = `class_repository_test.sqlite`;
let sqlite: Sqlite;
let repo: ClassRepository;

beforeAll(async () => {
  sqlite = await Sqlite.createInstance(DB_TEST);
  repo = new ClassRepository(sqlite);
});

afterAll(() => {
  const dbPath = Bun.fileURLToPath(
    import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
  );
  sqlite.close();
  Bun.file(dbPath).delete();
});

describe("ClassRepository", () => {
  const classData = {
    name: "Integration Test Class",
    schedule: 1,
    start_time: "08:00",
    end_time: "10:00",
  };
  const enrollKey = "INTTESTKEY123";
  let createdClassId: number;

  test("should create a class", () => {
    createdClassId = repo.create(classData, enrollKey) as number;

    const result = repo.findById(createdClassId);
    expect(result).not.toBeNull();
    expect(result?.name).toBe(classData.name);
    expect(result?.enroll_key).toBe(enrollKey);
  });

  test("should get all classes with pagination", () => {
    const result = repo.all(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should find a class by id", () => {
    const result = repo.findById(createdClassId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdClassId);
    expect(result?.name).toBe(classData.name);
  });

  test("should find a class by enroll key", () => {
    const result = repo.findByEnrollKey(enrollKey);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdClassId);
    expect(result?.enroll_key).toBe(enrollKey);
  });

  test("should update a class", () => {
    const updateData = { name: "Updated Integration Test Class" };

    repo.update(createdClassId, updateData);

    const updatedClass = repo.findById(createdClassId);
    expect(updatedClass?.name).toBe(updateData.name);
  });

  test("should delete a class", () => {
    expect(repo.findById(createdClassId)).not.toBeNull();

    repo.delete(createdClassId);

    const deletedClass = repo.findById(createdClassId);
    expect(deletedClass).toBeNull();
  });
});
