import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { DosenService } from "../dosen.service";
import { Sqlite } from "../../config/database";
import type { Dosen } from "../../models/dosen.model";

describe("DosenService", () => {
  const DB_TEST = `dosen_service_test.sqlite`;
  let sqlite: Sqlite;
  let dosenService: DosenService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    dosenService = new DosenService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a dosen", async () => {
    const dosenData = {
      nip: "1234567890",
      name: "Integration Test Dosen Service",
    } as Omit<Dosen, "password" | "id" | "created_at" | "updated_at"> & {
      password: string;
      username?: string;
    };

    const result = await dosenService.create(dosenData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(dosenData.name);
    expect(result?.nip).toBe(dosenData.nip);
    expect(result?.username).toBe(dosenData.nip);
    expect(result?.password).toBeUndefined();
  });

  test("should get all dosens with pagination", () => {
    const result = dosenService.getAll(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should get a dosen by id", async () => {
    const dosenData = {
      nip: "0987654321",
      name: "Get By ID Test Dosen Service",
    } as Omit<Dosen, "password" | "id" | "created_at" | "updated_at"> & {
      password: string;
      username?: string;
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    const result = dosenService.getById(createdDosen!.id!);

    expect(result).not.toBeNull();
    expect(result.id).toBe(createdDosen!.id);
    expect(result.name).toBe(dosenData.name);
  });

  test("should update a dosen", async () => {
    const dosenData = {
      nip: "1122334455",
      name: "Update Test Dosen Service",
    } as Omit<Dosen, "password" | "id" | "created_at" | "updated_at"> & {
      password: string;
      username?: string;
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    const updateData = { name: "Updated Integration Test Dosen Service" };
    const updatedDosen = await dosenService.update(
      createdDosen!.id!,
      updateData,
    );

    expect(updatedDosen).not.toBeNull();
    expect(updatedDosen?.name).toBe(updateData.name);
  });

  test("should delete a dosen", async () => {
    const dosenData = {
      nip: "5544332211",
      name: "Delete Test Dosen Service",
    } as Omit<Dosen, "password" | "id" | "created_at" | "updated_at"> & {
      password: string;
      username?: string;
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    const dosenBeforeDelete = dosenService.getById(createdDosen!.id!);
    expect(dosenBeforeDelete).not.toBeNull();

    const deletedDosen = dosenService.delete(createdDosen!.id!);

    expect(deletedDosen).not.toBeNull();
    expect(deletedDosen.id).toBe(createdDosen!.id);

    expect(() => {
      dosenService.getById(createdDosen!.id!);
    }).toThrow("Dosen not found");
  });

  test("should throw error when getting non-existent dosen by id", () => {
    expect(() => {
      dosenService.getById(999999);
    }).toThrow("Dosen not found");
  });

  test("should throw error when deleting non-existent dosen", () => {
    expect(() => {
      dosenService.delete(999999);
    }).toThrow("Dosen not found");
  });
});
