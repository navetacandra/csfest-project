import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { AuthService } from "../auth.service";
import { UserRepository } from "../../repositories/user.repository";
import { Sqlite } from "../../config/database";
import { MahasiswaService } from "../mahasiswa.service";
import { DosenService } from "../dosen.service";
import { AdminService } from "../admin.service";

describe("AuthService", () => {
  const DB_TEST = `auth_service_test.sqlite`;
  let sqlite: Sqlite;
  let authService: AuthService;
  let dosenService: DosenService;
  let adminService: AdminService;
  let mahasiswaService: MahasiswaService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    authService = new AuthService(sqlite);
    dosenService = new DosenService(sqlite);
    adminService = new AdminService(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should successfully login a mahasiswa", async () => {
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "123456789",
      name: "Test Mahasiswa",
      email: "test.mahasiswa@example.com",
      username: "test_mahasiswa_auth",
      password: "password123",
    };

    const mahasiswaId = await mahasiswaService.create(mahasiswaData);

    const result = await authService.login(
      "test_mahasiswa_auth",
      "password123",
    );

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("role");
    expect(result.role).toBe("mahasiswa");
  });

  test("should successfully login a dosen", async () => {
    const dosenData = {
      nip: "987654321",
      name: "Test Dosen",
      username: "test_dosen_auth",
      password: "password123",
    };

    const dosenId = await dosenService.create(dosenData);
    const result = await authService.login("test_dosen_auth", "password123");

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("role");
    expect(result.role).toBe("dosen");
  });

  test("should successfully login an admin", async () => {
    const adminData = {
      name: "Test Admin",
      username: "test_admin_auth",
      password: "password123",
    };

    const adminId = await adminService.create(adminData);

    const result = await authService.login("test_admin_auth", "password123");

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("role");
    expect(result.role).toBe("admin");
  });

  test("should throw error when login with invalid credentials", async () => {
    await expect(async () => {
      await authService.login("nonexistent_user", "password123");
    }).toThrow("Invalid username or password");

    await expect(async () => {
      await authService.login("test_mahasiswa_auth", "wrongpassword");
    }).toThrow("Invalid username or password");
  });
});
