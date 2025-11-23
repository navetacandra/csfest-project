import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { MajorService } from "../major.service";
import { Sqlite } from "../../config/database";

describe("MajorService", () => {
  const DB_TEST = `major_service_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sqlite`;
  let sqlite: Sqlite;
  let majorService: MajorService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    majorService = new MajorService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a major", () => {
    const majorData = {
      name: "Integration Test Major Service",
    };

    const result = majorService.create(majorData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(majorData.name);
  });

  test("should get all majors", () => {
    // Create a test major first
    const majorData = {
      name: "Get All Test Major Service",
    };
    majorService.create(majorData);

    const result = majorService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("should delete a major", () => {
    // Create a test major to delete
    const majorData = {
      name: "Delete Test Major Service",
    };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    // Verify major exists before deletion by getting it via service
    const majorBeforeDelete = majorService.getAll().find(m => m.id === createdMajor!.id);
    expect(majorBeforeDelete).not.toBeNull();

    // Delete the major
    const deletedMajor = majorService.delete(createdMajor!.id!);

    expect(deletedMajor).not.toBeNull();
    expect(deletedMajor.id).toBe(createdMajor!.id);

    // Verify major was deleted by trying to find it again
    expect(() => {
      majorService.delete(createdMajor!.id!); // This should throw since it's already deleted
    }).toThrow("Major not found");
  });

  test("should throw error when deleting non-existent major", () => {
    expect(() => {
      majorService.delete(999999);
    }).toThrow("Major not found");
  });
});