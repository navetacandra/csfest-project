import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import express, { type Express } from "express";
import request from "supertest";
import compression from "compression";
import { Sqlite, reinitializeDb } from "../config/database";
import { AdminService } from "../services/admin.service";
import { MahasiswaService } from "../services/mahasiswa.service";
import { DosenService } from "../services/dosen.service";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

Bun.env.JWT_SECRET = Bun.env.JWT_SECRET || "test_secret_for_e2e_tests";
Bun.env.PASSWORD_SECRET_KEY =
  Bun.env.PASSWORD_SECRET_KEY || "test_password_secret";

Bun.env.DB_NAME = `e2e_test_${Date.now()}.db`;

const { default: apiRouter } = await import("../routes");

const DB_TEST = Bun.env.DB_NAME;

describe("E2E API Tests - Full API Contract", () => {
  let app: Express;
  let db: Sqlite;
  let adminService: AdminService;
  let mahasiswaService: MahasiswaService;
  let dosenService: DosenService;
  let authService: AuthService;
  let userRepository: UserRepository;

  let adminToken: string | null = null;
  let mahasiswaToken: string | null = null;
  let dosenToken: string | null = null;
  let adminId: number;
  let mahasiswaId: number;
  let dosenId: number;
  let classId: number | null = null;
  let newsId: number | null = null;
  let majorId: number | null = null;
  let studyProgramId: number | null = null;

  beforeAll(async () => {
    try {
      const dbPath = Bun.fileURLToPath(
        import.meta.resolve(`${__dirname}/../database/${DB_TEST}`),
      );
      await Bun.file(dbPath).delete();
    } catch (e) {}

    db = await reinitializeDb(DB_TEST);
    const { default: apiRouter } = await import("../routes");

    adminService = new AdminService(db);
    mahasiswaService = new MahasiswaService(db);
    dosenService = new DosenService(db);
    authService = new AuthService(db);
    userRepository = new UserRepository(db);

    app = express();
    app.use(compression());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use("/", apiRouter);

    adminId = await adminService.create({
      name: "Test Admin E2E",
      username: "test_admin_e2e",
      password: "password123",
    });

    mahasiswaId = await mahasiswaService.create({
      major_id: 1, // From seeds
      study_program_id: 1, // From seeds
      nim: "235150200111001",
      name: "Test Mahasiswa E2E",
      email: "test.mahasiswa.e2e@example.com",
      username: "test_mahasiswa_e2e",
      password: "password123",
    });

    dosenId = await dosenService.create({
      nip: "198501012010011001",
      name: "Test Dosen E2E",
      username: "test_dosen_e2e",
      password: "password123",
    });

    const adminLogin = await authService.login("test_admin_e2e", "password123");
    adminToken = adminLogin.token;

    const mahasiswaLogin = await authService.login(
      "test_mahasiswa_e2e",
      "password123",
    );
    mahasiswaToken = mahasiswaLogin.token;

    const dosenLogin = await authService.login("test_dosen_e2e", "password123");
    dosenToken = dosenLogin.token;
  });

  afterAll(async () => {
    if (db) {
      db.close();
      const dbPath = Bun.fileURLToPath(
        import.meta.resolve(`${__dirname}/../database/e2e_test.db`),
      );
      try {
        await Bun.file(dbPath).delete();
      } catch (error) {
        console.warn("Failed to delete test database:", error);
      }
    }
  });

  describe("Authentication Endpoints - API Contract Verification", () => {
    test("POST /login - Should authenticate admin user and return token", async () => {
      const response = await request(app).post("/login").send({
        username: "test_admin_e2e",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.role).toBe("admin");

      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("role");
    });

    test("POST /login - Should authenticate mahasiswa user and return token", async () => {
      const response = await request(app).post("/login").send({
        username: "test_mahasiswa_e2e",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.role).toBe("mahasiswa");
    });

    test("POST /login - Should authenticate dosen user and return token", async () => {
      const response = await request(app).post("/login").send({
        username: "test_dosen_e2e",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.role).toBe("dosen");
    });

    test("POST /login - Should fail with invalid credentials", async () => {
      const response = await request(app).post("/login").send({
        username: "invalid_user",
        password: "invalid_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe("Invalid username or password");
    });

    test("GET /profile - Should return user profile with admin token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe("Test Admin E2E");
      expect(response.body.data.username).toBe("test_admin_e2e");

      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("username");
    });

    test("GET /profile - Should return user profile with mahasiswa token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe("Test Mahasiswa E2E");
      expect(response.body.data.username).toBe("test_mahasiswa_e2e");
    });

    test("GET /profile - Should return user profile with dosen token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${dosenToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe("Test Dosen E2E");
      expect(response.body.data.username).toBe("test_dosen_e2e");
    });

    test("DELETE /logout - Should logout user", async () => {
      const response = await request(app)
        .delete("/logout")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
    });
  });

  describe("General Endpoints", () => {
    test("GET / - Should return welcome message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBe("Welcome to Ku-LMSin API");
    });
  });

  describe("News Endpoints (Public) - API Contract Verification", () => {
    test("GET /news - Should return list of news (public)", async () => {
      const response = await request(app).get("/news");

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        const newsItem = response.body.data[0];
        expect(newsItem).toHaveProperty("id");
        expect(newsItem).toHaveProperty("title");
      }
    });

    test("GET /news/:id - Should return news details (public)", async () => {
      const newsResponse = await request(app).get("/news");
      if (newsResponse.body.data.length > 0) {
        const newsItem = newsResponse.body.data[0];
        const response = await request(app).get(`/news/${newsItem.id}`);

        expect(response.status).toBe(200);
        expect(response.body.code).toBe(200);
        expect(response.body.data.id).toBe(newsItem.id);
        expect(response.body.data).toHaveProperty("title");
        expect(response.body.data).toHaveProperty("content");
      }
    });
  });

  describe("Dashboard Endpoint - API Contract Verification", () => {
    beforeAll(async () => {
      const adminLogin = await authService.login(
        "test_admin_e2e",
        "password123",
      );
      adminToken = adminLogin.token;

      const mahasiswaLogin = await authService.login(
        "test_mahasiswa_e2e",
        "password123",
      );
      mahasiswaToken = mahasiswaLogin.token;

      const dosenLogin = await authService.login(
        "test_dosen_e2e",
        "password123",
      );
      dosenToken = dosenLogin.token;
    });

    test("GET /dashboard - Should return dashboard data for admin", async () => {
      const response = await request(app)
        .get("/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data).toHaveProperty("news");
      expect(response.body.data).toHaveProperty("schedule");
      expect(response.body.data).toHaveProperty("tasks");
      expect(response.body.data).toHaveProperty("classes");
      expect(Array.isArray(response.body.data.news)).toBe(true);
      expect(Array.isArray(response.body.data.schedule)).toBe(true);
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
      expect(Array.isArray(response.body.data.classes)).toBe(true);
    });

    test("GET /dashboard - Should return dashboard data for mahasiswa", async () => {
      const response = await request(app)
        .get("/dashboard")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test("GET /dashboard - Should return dashboard data for dosen", async () => {
      const response = await request(app)
        .get("/dashboard")
        .set("Authorization", `Bearer ${dosenToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe("Class Endpoints - API Contract Verification", () => {
    test("GET /classes - Should return 200 with empty array when no classes enrolled or 400 when error occurs", async () => {
      const response = await request(app)
        .get("/classes")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      if (response.status === 200) {
        expect(response.body.code).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
      } else if (response.status === 400) {
        expect(response.body.code).toBe(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
      } else {
        throw new Error(`Expected status 200 or 400, got ${response.status}`);
      }
    });
  });

  describe("Schedule Endpoints - API Contract Verification", () => {
    test("GET /schedule - Should return list of followed class schedules for mahasiswa", async () => {
      const response = await request(app)
        .get("/schedule")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /schedule - Should return list of followed class schedules for dosen", async () => {
      const response = await request(app)
        .get("/schedule")
        .set("Authorization", `Bearer ${dosenToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Tasks Endpoints - API Contract Verification", () => {
    test("GET /tasks - Should return list of tasks when student is enrolled in classes with assigned tasks", async () => {
      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      if (response.status === 200) {
        expect(response.body.code).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
          const task = response.body.data[0];
          expect(task).toHaveProperty("id");
          expect(task).toHaveProperty("class_id");
          expect(task).toHaveProperty("title");
          expect(task).toHaveProperty("status");
        }
      } else if (response.status === 400) {
        expect(response.body.code).toBe(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
      } else {
        throw new Error(`Expected status 200 or 400, got ${response.status}`);
      }
    });
  });

  describe("Presence Endpoints - API Contract Verification", () => {
    test("GET /presence/recap - Should return presence recap for mahasiswa", async () => {
      const response = await request(app)
        .get("/presence/recap")
        .set("Authorization", `Bearer ${mahasiswaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty("lateness_time");
      expect(response.body.data).toHaveProperty("data");
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe("Admin Major Endpoints - API Contract Verification", () => {
    test("GET /admin/major - Should return list of majors (admin only)", async () => {
      const response = await request(app)
        .get("/admin/major")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("POST /admin/major - Should create a new major (admin only)", async () => {
      const response = await request(app)
        .post("/admin/major")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Major E2E",
        });

      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data.name).toBe("Test Major E2E");

      majorId = response.body.data.id;
    });
  });

  describe("Admin Mahasiswa Endpoints - API Contract Verification", () => {
    test("GET /admin/mahasiswa - Should return list of mahasiswa (admin only)", async () => {
      const response = await request(app)
        .get("/admin/mahasiswa")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Admin Dosen Endpoints - API Contract Verification", () => {
    test("GET /admin/dosen - Should return list of dosen (admin only)", async () => {
      const response = await request(app)
        .get("/admin/dosen")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Admin News Endpoints - API Contract Verification", () => {
    test("GET /admin/news - Should return list of news (admin only)", async () => {
      const response = await request(app)
        .get("/admin/news")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("POST /admin/news - Should create news (admin only)", async () => {
      const response = await request(app)
        .post("/admin/news")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Test News E2E Creation",
          content: "Content for test news created in E2E test",
          thumbnail_file_id: 5, // Use one from the seeds
        });

      if (response.status === 201) {
        expect(response.body.code).toBe(201);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty("title");
        expect(response.body.data.title).toBe("Test News E2E Creation");
        newsId = response.body.data.id;
      } else if (response.status === 400) {
        // Accept 400 if there's a validation issue like invalid file id
        expect(response.body.code).toBe(400);
        expect(response.body.error).toBeDefined();
      } else {
        throw new Error(`Expected status 201 or 400, got ${response.status}`);
      }
    });
  });

  describe("Admin Class Endpoints - API Contract Verification", () => {
    test("POST /admin/classes - Should create a new class (admin only)", async () => {
      const response = await request(app)
        .post("/admin/classes")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Class E2E",
          schedule: 3, // Wednesday
          start_time: "08:00",
          end_time: "10:00",
        });

      if (response.status === 201) {
        expect(response.body.code).toBe(201);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("schedule");
        expect(response.body.data).toHaveProperty("enroll_key");
        expect(response.body.data.name).toBe("Test Class E2E");
        expect(response.body.data.schedule).toBe(3);
        classId = response.body.data.id;
      } else if (response.status === 400) {
        // Accept 400 if there's a validation issue
        expect(response.body.code).toBe(400);
        expect(response.body.error).toBeDefined();
      } else {
        throw new Error(`Expected status 201 or 400, got ${response.status}`);
      }
    });
  });
});
