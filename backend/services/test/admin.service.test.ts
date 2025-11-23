import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { AdminService } from "../admin.service";
import { Sqlite } from "../../config/database";

describe("AdminService", () => {
  const DB_TEST = `admin_service_test.db`;
  let sqlite: Sqlite;
  let adminService: AdminService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    adminService = new AdminService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create an admin", async () => {
    const adminData = {
      name: "Integration Test Admin Service",
      username: "test_admin_service",
      password: "password123",
    };

    const result = await adminService.create(adminData);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(adminData.name);
    expect(result?.username).toBe(adminData.username);
    expect(result?.password).toBeDefined();
  });

  test("should get all admins with pagination", () => {
    const result = adminService.getAll(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test("should get an admin by id", async () => {
    const adminData = {
      name: "Get By ID Test Admin Service",
      username: "test_getbyid_admin_service",
      password: "password123",
    };
    const createdAdmin = await adminService.create(adminData);
    expect(createdAdmin).not.toBeNull();

    const result = adminService.getById(createdAdmin!.id!);

    expect(result).not.toBeNull();
    expect(result.id).toBe(createdAdmin!.id);
    expect(result.name).toBe(adminData.name);
  });

  test("should update an admin", async () => {
    const adminData = {
      name: "Update Test Admin Service",
      username: "test_update_admin_service",
      password: "password123",
    };
    const createdAdmin = await adminService.create(adminData);
    expect(createdAdmin).not.toBeNull();

    const updateData = { name: "Updated Integration Test Admin Service" };
    const updatedAdmin = await adminService.update(
      createdAdmin!.id!,
      updateData,
    );

    expect(updatedAdmin).not.toBeNull();
    expect(updatedAdmin?.name).toBe(updateData.name);
  });

  test("should delete an admin", async () => {
    const adminData = {
      name: "Delete Test Admin Service",
      username: "test_delete_admin_service",
      password: "password123",
    };
    const createdAdmin = await adminService.create(adminData);
    expect(createdAdmin).not.toBeNull();

    const adminBeforeDelete = adminService.getById(createdAdmin!.id!);
    expect(adminBeforeDelete).not.toBeNull();

    const deletedAdmin = adminService.delete(createdAdmin!.id!);

    expect(deletedAdmin).not.toBeNull();
    expect(deletedAdmin.id).toBe(createdAdmin!.id);

    expect(() => {
      adminService.getById(createdAdmin!.id!);
    }).toThrow("Admin not found");
  });

  test("should throw error when creating admin without password", async () => {
    const adminData = {
      name: "No Password Test Admin Service",
      username: "test_nopass_admin_service",
    } as any;

    await expect(async () => {
      await adminService.create(adminData);
    }).toThrow("Password is required to create a new admin.");
  });

  test("should throw error when getting non-existent admin by id", () => {
    expect(() => {
      adminService.getById(999999);
    }).toThrow("Admin not found");
  });

  test("should throw error when deleting non-existent admin", () => {
    expect(() => {
      adminService.delete(999999);
    }).toThrow("Admin not found");
  });
});
