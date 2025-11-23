import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { MajorService } from "../major.service";
import { Sqlite } from "../../config/database";

describe("MajorService", () => {
  const DB_TEST = `major_service_test.sqlite`;
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
    const majorData = {
      name: "Get All Test Major Service",
    };
    majorService.create(majorData);

    const result = majorService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("should get a major by id", () => {
    const majorData = { name: "Get By Id Test" };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    const result = majorService.getById(createdMajor!.id);
    expect(result).not.toBeNull();
    expect(result.id).toBe(createdMajor!.id);
  });

  test("should throw error when getting non-existent major by id", () => {
    expect(() => {
      majorService.getById(999999);
    }).toThrow("Major not found");
  });

  test("should update a major", () => {
    const majorData = { name: "Update Test" };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    const updatedName = "Updated Major Name";
    const result = majorService.update(createdMajor!.id, { name: updatedName });

    expect(result).not.toBeNull();
    expect(result?.name).toBe(updatedName);
  });

  test("should delete a major", () => {
    const majorData = {
      name: "Delete Test Major Service",
    };
    const createdMajor = majorService.create(majorData);
    expect(createdMajor).not.toBeNull();

    const majorBeforeDelete = majorService
      .getAll()
      .find((m) => m.id === createdMajor!.id);
    expect(majorBeforeDelete).not.toBeNull();

    const deletedMajor = majorService.delete(createdMajor!.id!);

    expect(deletedMajor).not.toBeNull();
    expect(deletedMajor.id).toBe(createdMajor!.id);

    expect(() => {
      majorService.delete(createdMajor!.id!);
    }).toThrow("Major not found");
  });

  test("should throw error when deleting non-existent major", () => {
    expect(() => {
      majorService.delete(999999);
    }).toThrow("Major not found");
  });
});
