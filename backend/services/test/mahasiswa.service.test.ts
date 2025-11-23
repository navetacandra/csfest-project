import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { MahasiswaService } from "../mahasiswa.service";
import { Sqlite } from "../../config/database";

describe("MahasiswaService", () => {
  const DB_TEST = `mahasiswa_service_test.db`;
  let sqlite: Sqlite;
  let mahasiswaService: MahasiswaService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    mahasiswaService = new MahasiswaService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a mahasiswa", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "123456789",
      name: "Integration Test Mahasiswa Service",
      email: "test.mahasiswa.service@example.com",
      username: "test_mahasiswa_service",
      password: "password123",
    };

    const result = await mahasiswaService.create(mahasiswaData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(mahasiswaData.name);
    expect(result?.nim).toBe(mahasiswaData.nim);
    expect(result?.username).toBe(mahasiswaData.username);
    expect(result?.password).toBeUndefined();
  });

  test("should get all mahasiswas with pagination", () => {
    const result = mahasiswaService.getAll(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should get a mahasiswa by id", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "987654321",
      name: "Get By ID Test Mahasiswa Service",
      email: "test.getbyid.service@example.com",
      username: "test_getbyid_service",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const result = mahasiswaService.getById(createdMahasiswa!.id!);

    expect(result).not.toBeNull();
    expect(result.id).toBe(createdMahasiswa!.id);
    expect(result.name).toBe(mahasiswaData.name);
  });

  test("should update a mahasiswa", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "112233445",
      name: "Update Test Mahasiswa Service",
      email: "test.update.service@example.com",
      username: "test_update_service",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const updateData = { name: "Updated Integration Test Mahasiswa Service" };
    const updatedMahasiswa = await mahasiswaService.update(
      createdMahasiswa!.id!,
      updateData,
    );

    expect(updatedMahasiswa).not.toBeNull();
    expect(updatedMahasiswa?.name).toBe(updateData.name);
  });

  test("should delete a mahasiswa", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "556677889",
      name: "Delete Test Mahasiswa Service",
      email: "test.delete.service@example.com",
      username: "test_delete_service",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const mahasiswaBeforeDelete = mahasiswaService.getById(
      createdMahasiswa!.id!,
    );
    expect(mahasiswaBeforeDelete).not.toBeNull();

    const deletedMahasiswa = mahasiswaService.delete(createdMahasiswa!.id!);

    expect(deletedMahasiswa).not.toBeNull();
    expect(deletedMahasiswa.id).toBe(createdMahasiswa!.id);

    expect(() => {
      mahasiswaService.getById(createdMahasiswa!.id!);
    }).toThrow("Mahasiswa not found");
  });

  test("should throw error when creating mahasiswa without password", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "998877665",
      name: "No Password Test Mahasiswa Service",
      email: "test.nopass.service@example.com",
      username: "test_nopass_service",
    } as any;

    await expect(async () => {
      await mahasiswaService.create(mahasiswaData);
    }).toThrow("Password is required to create a new mahasiswa.");
  });

  test("should throw error when getting non-existent mahasiswa by id", () => {
    expect(() => {
      mahasiswaService.getById(999999);
    }).toThrow("Mahasiswa not found");
  });

  test("should throw error when deleting non-existent mahasiswa", () => {
    expect(() => {
      mahasiswaService.delete(999999);
    }).toThrow("Mahasiswa not found");
  });
});
