import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { AdminRepository } from "../admin.repository";
import type { Admin } from "../../models/admin.model";
import { Sqlite } from "../../config/database";

describe("AdminRepository", () => {
  const DB_TEST = `admin_repository_test.sqlite`;
  let sqlite: Sqlite;
  let repo: AdminRepository;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    repo = new AdminRepository(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  const adminData: Omit<Admin, "id" | "created_at" | "updated_at"> = {
    name: "Integration Test Admin",
    username: "integration.test.admin",
    password: "password123",
  };
  let createdAdminId: number;

  test("should create an admin", () => {
    createdAdminId = repo.create(adminData) as number;

    const result = repo.findById(createdAdminId);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(adminData.name);
    expect(result?.username).toBe(adminData.username);
  });

  test("should find by id", () => {
    const result = repo.findById(createdAdminId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdAdminId);
  });

  test("should find by username", () => {
    const result = repo.findByUsername(adminData.username);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdAdminId);
  });

  test("should get all admins with seeded data", () => {
    const additionalAdminData: Omit<Admin, "id" | "created_at" | "updated_at"> =
      {
        name: "Additional Test Admin",
        username: "additional.test.admin",
        password: "password123",
      };
    const additionalAdminId = repo.create(additionalAdminData) as number;

    const result = repo.all(1, 10);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: createdAdminId,
        name: adminData.name,
      }),
    );
  });

  test("should find admin from seeded data by ID", () => {
    const seededAdmin = repo.findById(1);

    expect(seededAdmin).not.toBeNull();
    if (seededAdmin) {
      expect(seededAdmin.id).toBe(1);
      expect(seededAdmin.name).toBe("Super Admin");
      expect(seededAdmin.username).toBe("superadmin");
    }
  });

  test("should find admin from seeded data by username", () => {
    const seededAdmin = repo.findByUsername("superadmin");

    expect(seededAdmin).not.toBeNull();
    if (seededAdmin) {
      expect(seededAdmin.id).toBe(1);
      expect(seededAdmin.name).toBe("Super Admin");
      expect(seededAdmin.username).toBe("superadmin");
    }
  });

  test("should update an admin", () => {
    const updateData = { name: "Updated Integration Test Admin" };

    repo.update(createdAdminId, updateData);

    const updatedResult = repo.findById(createdAdminId);
    expect(updatedResult?.name).toBe(updateData.name);
  });

  test("should delete an admin", () => {
    const testData: Omit<Admin, "id" | "created_at" | "updated_at"> = {
      ...adminData,
      name: "Test Delete Admin",
      username: "test.delete.admin",
    };
    const testAdminId = repo.create(testData);

    expect(repo.findById(testAdminId)).not.toBeNull();

    repo.delete(testAdminId);

    const deletedAdmin = repo.findById(testAdminId);
    expect(deletedAdmin).toBeNull();
  });
});
