import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { PresenceService } from "../presence.service";
import { Sqlite } from "../../config/database";
import { ClassService } from "../class.service";
import { MahasiswaService } from "../mahasiswa.service";
import { ClassEnrollmentRepository } from "../../repositories/classEnrollment.repository";
import { DosenService } from "../dosen.service";

describe("PresenceService", () => {
  const DB_TEST = `presence_service_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sqlite`;
  let sqlite: Sqlite;
  let presenceService: PresenceService;
  let classService: ClassService;
  let mahasiswaService: MahasiswaService;
  let classEnrollmentRepo: ClassEnrollmentRepository;
  let dosenService: DosenService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    presenceService = new PresenceService(sqlite);
    classService = new ClassService(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
    classEnrollmentRepo = new ClassEnrollmentRepository(sqlite);
    dosenService = new DosenService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should set presence for a mahasiswa", async () => {
    // Create a test class
    const classData = {
      name: "Test Class for Presence Service",
      schedule: 1,
      start_time: "09:00",
      end_time: "11:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();
    expect(createdClass?.id).toBeGreaterThan(0);

    // Create a test mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "123987456",
      name: "Test Mahasiswa Presence",
      email: "test.presence@example.com",
      username: "test_presence_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();
    expect(createdMahasiswa?.id).toBeGreaterThan(0);

    // Enroll the mahasiswa to the class using the class service
    const enrolledClass = classService.enroll(createdClass?.enroll_key!, createdMahasiswa!.id!, "mahasiswa");
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(createdMahasiswa!.id!);
    const enrollment = enrollments.find(e => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const result = presenceService.setPresence(
      createdClass!.id!,
      { role: 'mahasiswa', id: createdMahasiswa!.id! },
      { schedule_date: "2025-11-23", status: 'hadir' }
    );

    expect(result).not.toBeNull();
    expect(result?.class_enrollment_id).toBe(enrollment!.id);
    expect(result?.status).toBe('hadir');
    expect(result?.schedule_date).toBe("2025-11-23");
  });

  test("should set presence for a student by a dosen", async () => {
    // Create a test class
    const classData = {
      name: "Test Class Dosen for Presence Service",
      schedule: 2,
      start_time: "10:00",
      end_time: "12:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a test mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "112233445",
      name: "Test Mahasiswa Dosen Presence",
      email: "test.dosen.presence@example.com",
      username: "test_dosen_presence_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Create a test dosen
    const dosenData = {
      nip: "998877665",
      name: "Test Dosen Presence",
      username: "test_dosen_presence",
      password: "password123",
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    // Enroll the mahasiswa to the class using the class service
    const enrolledClass = classService.enroll(createdClass?.enroll_key!, createdMahasiswa!.id!, "mahasiswa");
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(createdMahasiswa!.id!);
    const enrollment = enrollments.find(e => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const result = presenceService.setPresence(
      createdClass!.id!,
      { role: 'dosen', id: createdDosen!.id! },
      {
        schedule_date: "2025-11-23",
        status: 'hadir',
        studentId: createdMahasiswa!.id!,
        late_time: 5
      }
    );

    expect(result).not.toBeNull();
    expect(result?.class_enrollment_id).toBe(enrollment!.id);
    expect(result?.status).toBe('hadir');
    expect(result?.late_time).toBe(5);
    expect(result?.schedule_date).toBe("2025-11-23");
  });

  test("should get presence recap for a student", async () => {
    // Create a test class
    const classData = {
      name: "Test Class Recap for Presence Service",
      schedule: 3,
      start_time: "13:00",
      end_time: "15:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a test mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "556677889",
      name: "Test Mahasiswa Recap Presence",
      email: "test.recap.presence@example.com",
      username: "test_recap_presence_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Enroll the mahasiswa to the class using the class service
    const enrolledClass = classService.enroll(createdClass?.enroll_key!, createdMahasiswa!.id!, "mahasiswa");
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(createdMahasiswa!.id!);
    const enrollment = enrollments.find(e => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    // Set some presence records
    presenceService.setPresence(
      createdClass!.id!,
      { role: 'mahasiswa', id: createdMahasiswa!.id! },
      { schedule_date: "2025-11-22", status: 'hadir' }
    );

    presenceService.setPresence(
      createdClass!.id!,
      { role: 'mahasiswa', id: createdMahasiswa!.id! },
      { schedule_date: "2025-11-23", status: 'hadir' }
    );

    const recap = presenceService.getRecap(createdMahasiswa!.id!);

    expect(recap).toHaveProperty("accumulated_late");
    expect(recap).toHaveProperty("recap");
    expect(Array.isArray(recap.recap)).toBe(true);
    expect(recap.accumulated_late).toBeGreaterThanOrEqual(0);
  });

  test("should throw error when mahasiswa tries to set invalid status", async () => {
    // Create a test class
    const classData = {
      name: "Test Class Error for Presence Service",
      schedule: 4,
      start_time: "14:00",
      end_time: "16:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a test mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "998877112",
      name: "Test Mahasiswa Error Presence",
      email: "test.error.presence@example.com",
      username: "test_error_presence_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Enroll the mahasiswa to the class using the class service
    const enrolledClass = classService.enroll(createdClass?.enroll_key!, createdMahasiswa!.id!, "mahasiswa");
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(createdMahasiswa!.id!);
    const enrollment = enrollments.find(e => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    expect(() => {
      presenceService.setPresence(
        createdClass!.id!,
        { role: 'mahasiswa', id: createdMahasiswa!.id! },
        { schedule_date: "2025-11-23", status: 'izin', late_time: 10 }  // Mahasiswa cannot set status to 'izin' or late_time
      );
    }).toThrow("Mahasiswa can only set their own status to 'hadir' with no lateness.");
  });

  test("should throw error when dosen doesn't provide studentId", async () => {
    // Create a test class
    const classData = {
      name: "Test Class No Student ID for Presence Service",
      schedule: 5,
      start_time: "15:00",
      end_time: "17:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a test dosen
    const dosenData = {
      nip: "112233445",
      name: "Test Dosen No StudentID Presence",
      username: "test_nostudentid_presence",
      password: "password123",
    };
    const createdDosen = await dosenService.create(dosenData);
    expect(createdDosen).not.toBeNull();

    expect(() => {
      presenceService.setPresence(
        createdClass!.id!,
        { role: 'dosen', id: createdDosen!.id! },
        { schedule_date: "2025-11-23", status: 'hadir' }  // Missing studentId
      );
    }).toThrow("studentId is required for dosen to set presence.");
  });
});