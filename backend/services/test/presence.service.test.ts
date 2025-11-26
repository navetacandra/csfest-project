import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { PresenceService } from "../presence.service";
import { Sqlite } from "../../config/database";
import { ClassService } from "../class.service";
import { MahasiswaService } from "../mahasiswa.service";
import { ClassEnrollmentRepository } from "../../repositories/classEnrollment.repository";
import { DosenRepository } from "../../repositories/dosen.repository";
import { MajorRepository } from "../../repositories/major.repository";
import { StudyProgramRepository } from "../../repositories/studyProgram.repository";
import { unlinkSync } from "node:fs";
import { ClassRepository } from "../../repositories/class.repository";
import { MahasiswaRepository } from "../../repositories/mahasiswa.repository";
import { PresenceRepository } from "../../repositories/presence.repository";

let testData: {
  majorId?: number;
  studyProgramId?: number;
  studentOneId?: number;
  studentTwoId?: number;
  dosenOneId?: number;
  classAId?: number;
  classBId?: number;
  enrollmentS1CAId?: number; // Student One in Class A
  enrollmentS1CBId?: number; // Student One in Class B
  enrollmentS2CAId?: number; // Student Two in Class A
  enrollmentD1CAId?: number; // Dosen One for Class A
};

describe("PresenceService", () => {
  const DB_TEST = `presence_service_test.db`;
  let sqlite: Sqlite;
  let presenceService: PresenceService;
  let classService: ClassService;
  let mahasiswaService: MahasiswaService;
  let classEnrollmentRepo: ClassEnrollmentRepository;
  let dosenRepository: DosenRepository; // Using repository directly for seeding
  let classRepository: ClassRepository;
  let mahasiswaRepository: MahasiswaRepository;
  let presenceRepository: PresenceRepository;
  let majorRepository: MajorRepository;
  let studyProgramRepository: StudyProgramRepository;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    presenceService = new PresenceService(sqlite);
    classService = new ClassService(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
    classEnrollmentRepo = new ClassEnrollmentRepository(sqlite);
    dosenRepository = new DosenRepository(sqlite); // Use repository for seeding
    classRepository = new ClassRepository(sqlite);
    mahasiswaRepository = new MahasiswaRepository(sqlite);
    presenceRepository = new PresenceRepository(sqlite);
    majorRepository = new MajorRepository(sqlite);
    studyProgramRepository = new StudyProgramRepository(sqlite);
  });

  beforeEach(async () => {
    // Clear data (still using direct SQL for mass cleanup for now, as it's about state reset)
    sqlite.query("DELETE FROM presence");
    sqlite.query("DELETE FROM class_enrollment");
    sqlite.query("DELETE FROM class");
    sqlite.query("DELETE FROM mahasiswa");
    sqlite.query("DELETE FROM dosen");
    sqlite.query("DELETE FROM study_program");
    sqlite.query("DELETE FROM major");

    // Seed data using repositories/services
    testData = {}; // Reset testData for each test

    testData.majorId = majorRepository.create({ name: 'Test Major' });
    testData.studyProgramId = studyProgramRepository.create({ name: 'Test SP', major_id: testData.majorId });

    // Mahasiswa
    const createdStudentOne = await mahasiswaService.create({
      major_id: testData.majorId,
      study_program_id: testData.studyProgramId,
      nim: '111',
      name: 'Student One',
      email: 's1@test.com',
      username: 's1',
      password: 'pass'
    });
    testData.studentOneId = createdStudentOne?.id;

    const createdStudentTwo = await mahasiswaService.create({
      major_id: testData.majorId,
      study_program_id: testData.studyProgramId,
      nim: '222',
      name: 'Student Two',
      email: 's2@test.com',
      username: 's2',
      password: 'pass'
    });
    testData.studentTwoId = createdStudentTwo?.id;

    // Dosen
    testData.dosenOneId = dosenRepository.create({
      nip: 'D1',
      name: 'Dosen One',
      username: 'd1',
      password: 'pass'
    });

    // Class (ids will be auto-generated, need to capture)
    const classA = classService.createWithActivationDate({
      name: 'Class A',
      schedule: 3, // Wednesday
      start_time: '08:00',
      end_time: '10:00',
      activated_at: '2025-01-01 00:00:00'
    });
    expect(classA).not.toBeNull();
    testData.classAId = classA?.id;

    const classB = classService.createWithActivationDate({
      name: 'Class B',
      schedule: 2, // Tuesday
      start_time: '10:00',
      end_time: '12:00',
      activated_at: '2025-01-01 00:00:00'
    });
    expect(classB).not.toBeNull();
    testData.classBId = classB?.id;

    // Class Enrollment
    testData.enrollmentS1CAId = classEnrollmentRepo.create({ class_id: testData.classAId!, mahasiswa_id: testData.studentOneId!, dosen_id: null }); // Student One in Class A
    testData.enrollmentS1CBId = classEnrollmentRepo.create({ class_id: testData.classBId!, mahasiswa_id: testData.studentOneId!, dosen_id: null }); // Student One in Class B
    testData.enrollmentS2CAId = classEnrollmentRepo.create({ class_id: testData.classAId!, mahasiswa_id: testData.studentTwoId!, dosen_id: null }); // Student Two in Class A
    testData.enrollmentD1CAId = classEnrollmentRepo.create({ class_id: testData.classAId!, mahasiswa_id: null, dosen_id: testData.dosenOneId! }); // Dosen One for Class A
  });

  afterAll(() => {
    sqlite.close();
    try {
      unlinkSync(sqlite.database_path); // Use the database_path from the instance
    } catch (e) {
      // ignore
    }
  });

  test("mahasiswa should set their own presence for today as hadir", async () => {
    const today = new Date().toISOString().split("T")[0]!;
    const result = presenceService.setPresence(
      testData.classAId!,
      { role: "mahasiswa", id: testData.studentOneId! },
      {}, // Student payload doesn't need schedule_date, status, late_time, studentId
    );
    const presence = presenceRepository.findByEnrollmentIdAndDate(testData.enrollmentS1CAId!, today);

    expect(presence).not.toBeNull();
    expect(presence?.status).toBe("hadir");
    expect(presence?.late_time).toBe(0);
    expect(presence?.schedule_date).toBe(today);
  });

  test("mahasiswa cannot set presence for other students or specify lateness", async () => {
    const today = new Date().toISOString().split("T")[0]!;
    expect(() => {
      presenceService.setPresence(
        testData.classAId!,
        { role: "mahasiswa", id: testData.studentOneId! },
        { studentId: testData.studentTwoId!, late_time: 10, schedule_date: today, status: "hadir" },
      );
    }).toThrow(
      "Mahasiswa cannot set presence for other students or specify lateness.",
    );
  });

  test("dosen should set presence for multiple students in a class", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduleDate = tomorrow.toISOString().split("T")[0]!;

    const presencesPayload = [
      { studentId: testData.studentOneId!, status: "hadir" as const, late_time: 5, schedule_date: scheduleDate },
      { studentId: testData.studentTwoId!, status: "sakit" as const, late_time: 0, schedule_date: scheduleDate },
    ];

    presenceService.setPresence(
      testData.classAId!,
      { role: "dosen", id: testData.dosenOneId! },
      presencesPayload,
    );

    const presenceS1 = presenceRepository.findByEnrollmentIdAndDate(testData.enrollmentS1CAId!, scheduleDate);
    const presenceS2 = presenceRepository.findByEnrollmentIdAndDate(testData.enrollmentS2CAId!, scheduleDate);

    expect(presenceS1).not.toBeNull();
    expect(presenceS1?.status).toBe("hadir");
    expect(presenceS1?.late_time).toBe(5);

    expect(presenceS2).not.toBeNull();
    expect(presenceS2?.status).toBe("sakit");
    expect(presenceS2?.late_time).toBe(0);
  });

  test("dosen should update existing presence for students in a class", async () => {
    const scheduleDate = "2025-01-08"; // Assuming a date for easy testing

    // Initial presence
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: scheduleDate, status: "hadir", late_time: 0 });
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS2CAId!, schedule_date: scheduleDate, status: "alpha", late_time: 0 });

    const presencesPayload = [
      { studentId: testData.studentOneId!, status: "sakit" as const, late_time: 10, schedule_date: scheduleDate },
      { studentId: testData.studentTwoId!, status: "hadir" as const, late_time: 0, schedule_date: scheduleDate },
    ];

    presenceService.setPresence(
      testData.classAId!,
      { role: "dosen", id: testData.dosenOneId! },
      presencesPayload,
    );

    const presenceS1 = presenceRepository.findByEnrollmentIdAndDate(testData.enrollmentS1CAId!, scheduleDate);
    const presenceS2 = presenceRepository.findByEnrollmentIdAndDate(testData.enrollmentS2CAId!, scheduleDate);

    expect(presenceS1).not.toBeNull();
    expect(presenceS1?.status).toBe("sakit");
    expect(presenceS1?.late_time).toBe(10);

    expect(presenceS2).not.toBeNull();
    expect(presenceS2?.status).toBe("hadir");
    expect(presenceS2?.late_time).toBe(0);
  });

  test("should get 18-week recap for a mahasiswa", async () => {
    // Create some presence data for studentOneId in ClassA
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: "2025-01-01", status: "hadir", late_time: 0 }); // Wednesday
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: "2025-01-08", status: "sakit", late_time: 0 }); // Wednesday
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: "2025-01-15", status: "hadir", late_time: 15 }); // Wednesday

    const recap = presenceService.getMahasiswaRecap(testData.studentOneId!);

    expect(recap).toHaveProperty("lateness_time");
    expect(recap).toHaveProperty("data");
    expect(recap.data.length).toBeGreaterThanOrEqual(1);

    const classARecap = recap.data.find((c) => c.class_id === testData.classAId);
    expect(classARecap).toBeDefined();
    expect(classARecap?.recap.length).toBe(18);

    expect(recap.lateness_time).toBe(15);
  });

  test("should get 18-week recap for a dosen for a specific class", async () => {
    const classId = testData.classAId!; // Class A
    const scheduleDate1 = "2025-01-01"; // Wednesday
    const scheduleDate2 = "2025-01-08"; // Wednesday

    // Presences for Student One in Class A
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: scheduleDate1, status: "hadir", late_time: 0 });
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS1CAId!, schedule_date: scheduleDate2, status: "sakit", late_time: 10 });

    // Presences for Student Two in Class A
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS2CAId!, schedule_date: scheduleDate1, status: "alpha", late_time: 0 });
    presenceRepository.create({ class_enrollment_id: testData.enrollmentS2CAId!, schedule_date: scheduleDate2, status: "hadir", late_time: 0 });

    const recap = presenceService.getDosenRecap(classId);

    expect(recap).toHaveProperty("members");
    expect(recap).toHaveProperty("recap");
    expect(recap.members.length).toBe(2); // Student One and Student Two
    expect(recap.recap.length).toBe(18); // 18 weeks

    // First week (2025-01-01)
    const firstWeekRecap = recap.recap[0];
    expect(firstWeekRecap.schedule_date).toBe("2025-01-01"); // First generated date is 2025-01-01
    const s1RecapWeek1 = firstWeekRecap.data.find((d) => d.mahasiswa_id === testData.studentOneId);
    const s2RecapWeek1 = firstWeekRecap.data.find((d) => d.mahasiswa_id === testData.studentTwoId);

    expect(s1RecapWeek1?.status).toBe("hadir");
    expect(s1RecapWeek1?.late_time).toBe(0);
    expect(s2RecapWeek1?.status).toBe("alpha");
    expect(s2RecapWeek1?.late_time).toBe(0);

    // Second week (2025-01-08)
    const secondWeekRecap = recap.recap[1];
    expect(secondWeekRecap.schedule_date).toBe("2025-01-08"); // Second generated date is 2025-01-08
    const s1RecapWeek2 = secondWeekRecap.data.find((d) => d.mahasiswa_id === testData.studentOneId);
    const s2RecapWeek2 = secondWeekRecap.data.find((d) => d.mahasiswa_id === testData.studentTwoId);

    expect(s1RecapWeek2?.status).toBe("sakit");
    expect(s1RecapWeek2?.late_time).toBe(10);
    expect(s2RecapWeek2?.status).toBe("hadir");
    expect(s2RecapWeek2?.late_time).toBe(0);

    // Other weeks should have null status
    const thirdWeekRecap = recap.recap[2];
    expect(thirdWeekRecap.schedule_date).toBe("2025-01-15");
    const s1RecapWeek3 = thirdWeekRecap.data.find((d) => d.mahasiswa_id === testData.studentOneId);
    expect(s1RecapWeek3?.status).toBeNull();
  });
});