import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { TaskService } from "../task.service";
import { Sqlite } from "../../config/database";
import { ClassService } from "../class.service";
import { MahasiswaService } from "../mahasiswa.service";
import { ClassEnrollmentRepository } from "../../repositories/classEnrollment.repository";
import { PostService } from "../post.service";
import { FileRepository } from "../../repositories/file.repository";
import type { Post } from "../../models/post.model";

describe("TaskService", () => {
  const DB_TEST = `task_service_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sqlite`;
  let sqlite: Sqlite;
  let taskService: TaskService;
  let classService: ClassService;
  let mahasiswaService: MahasiswaService;
  let classEnrollmentRepo: ClassEnrollmentRepository;
  let postService: PostService;
  let fileRepo: FileRepository;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    taskService = new TaskService(sqlite);
    classService = new ClassService(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
    classEnrollmentRepo = new ClassEnrollmentRepository(sqlite);
    postService = new PostService(sqlite);
    fileRepo = new FileRepository(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should submit a task", async () => {
    // Create a class
    const classData = {
      name: "Test Class for Task Service",
      schedule: 1,
      start_time: "09:00",
      end_time: "11:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();
    expect(createdClass?.id).toBeGreaterThan(0);

    // Create a mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "123987654",
      name: "Test Mahasiswa Task",
      email: "test.task@example.com",
      username: "test_task_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();
    expect(createdMahasiswa?.id).toBeGreaterThan(0);

    // Enroll the mahasiswa in the class using the class service
    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();

    // Create a post of type 'task'
    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: 1, // Use a default file_id for test
      message: "Integration Test Task Service",
      type: "task",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();
    expect(createdPost?.id).toBeGreaterThan(0);

    // Create a file for the task submission
    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_task_submission.pdf",
      random_name: "random_task_submission_file.pdf",
      size: 56789,
      mimetype: "application/pdf",
    };
    const createdFileId = fileRepo.create(fileData);
    expect(createdFileId).toBeGreaterThan(0);

    const result = taskService.submitTask(
      createdPost!.id!,
      createdMahasiswa!.id!,
      createdClass!.id!,
      createdFileId as number,
    );

    expect(result).not.toBeNull();
    expect(result?.post_id).toBe(createdPost!.id);
    // The enrollment ID should match the one we found earlier
    expect(result?.class_enrollment_id).toBe(enrollment?.id);
    expect(result?.file_id).toBe(createdFileId);
  });

  test("should get tasks for a student", async () => {
    // Create a class
    const classData = {
      name: "Test Class Get Tasks for Task Service",
      schedule: 2,
      start_time: "10:00",
      end_time: "12:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "987654321",
      name: "Test Mahasiswa Get Tasks",
      email: "test.get.tasks@example.com",
      username: "test_get_tasks_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Enroll the mahasiswa in the class using the class service
    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();

    // Create a post of type 'task'
    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: 2, // Use a different file_id for test
      message: "Get Tasks Test Task Service",
      type: "task",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    // Get tasks without submitting any yet (should return as 'incoming')
    const allTasks = taskService.getTasks(createdMahasiswa!.id!, "all");
    expect(Array.isArray(allTasks)).toBe(true);

    const incomingTasks = taskService.getTasks(
      createdMahasiswa!.id!,
      "incoming",
    );
    expect(Array.isArray(incomingTasks)).toBe(true);

    // Now submit a task
    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_get_tasks_submission.pdf",
      random_name: "random_get_tasks_submission_file.pdf",
      size: 67890,
      mimetype: "application/pdf",
    };
    const createdFileId = fileRepo.create(fileData);
    expect(createdFileId).toBeGreaterThan(0);

    taskService.submitTask(
      createdPost!.id!,
      createdMahasiswa!.id!,
      createdClass!.id!,
      createdFileId as number,
    );

    // Get completed tasks
    const completedTasks = taskService.getTasks(
      createdMahasiswa!.id!,
      "completed",
    );
    expect(Array.isArray(completedTasks)).toBe(true);
    expect(completedTasks).toContainEqual(
      expect.objectContaining({
        id: createdPost!.id,
        status: "completed",
      }),
    );
  });

  test("should throw error when student is not enrolled in class", async () => {
    // Create a mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "112233445",
      name: "Test Mahasiswa Not Enrolled",
      email: "test.not.enrolled@example.com",
      username: "test_not_enrolled_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Create a class
    const classData = {
      name: "Test Class Not Enrolled for Task Service",
      schedule: 3,
      start_time: "11:00",
      end_time: "13:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a post of type 'task'
    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: 1, // Use an enrollment that doesn't belong to the student
      file_id: 3,
      message: "Not Enrolled Test Task Service",
      type: "task",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    // Create a file for the task submission
    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_not_enrolled_submission.pdf",
      random_name: "random_not_enrolled_submission_file.pdf",
      size: 78901,
      mimetype: "application/pdf",
    };
    const createdFileId = fileRepo.create(fileData);
    expect(createdFileId).toBeGreaterThan(0);

    expect(() => {
      taskService.submitTask(
        createdPost!.id!,
        createdMahasiswa!.id!,
        createdClass!.id!,
        createdFileId as number,
      );
    }).toThrow("Student is not enrolled in this class.");
  });

  test("should throw error when task post is not found", async () => {
    // Create a mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "554433221",
      name: "Test Mahasiswa Task Not Found",
      email: "test.task.not.found@example.com",
      username: "test_task_not_found_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Create a class
    const classData = {
      name: "Test Class Task Not Found for Task Service",
      schedule: 4,
      start_time: "12:00",
      end_time: "14:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Enroll the mahasiswa in the class using the class service
    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();

    // Create a file for the task submission
    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_task_not_found_submission.pdf",
      random_name: "random_task_not_found_submission_file.pdf",
      size: 89012,
      mimetype: "application/pdf",
    };
    const createdFileId = fileRepo.create(fileData);
    expect(createdFileId).toBeGreaterThan(0);

    expect(() => {
      taskService.submitTask(
        999999, // Non-existent post id
        createdMahasiswa!.id!,
        createdClass!.id!,
        createdFileId as number,
      );
    }).toThrow("Task post not found.");
  });

  test("should throw error when task is already submitted", async () => {
    // Create a class
    const classData = {
      name: "Test Class Already Submitted for Task Service",
      schedule: 5,
      start_time: "13:00",
      end_time: "15:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    // Create a mahasiswa
    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "998877665",
      name: "Test Mahasiswa Already Submitted",
      email: "test.already.submitted@example.com",
      username: "test_already_submitted_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    // Enroll the mahasiswa in the class using the class service
    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    // Get the enrollment ID that was created when the mahasiswa was enrolled
    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();

    // Create a post of type 'task'
    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: 4,
      message: "Already Submitted Test Task Service",
      type: "task",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    // Create a file for the task submission
    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_already_submitted_submission.pdf",
      random_name: "random_already_submitted_submission_file.pdf",
      size: 90123,
      mimetype: "application/pdf",
    };
    const createdFileFirst = fileRepo.create(fileData);
    expect(createdFileFirst).toBeGreaterThan(0);

    // Submit the task for the first time
    const firstSubmission = taskService.submitTask(
      createdPost!.id!,
      createdMahasiswa!.id!,
      createdClass!.id!,
      createdFileFirst as number,
    );
    expect(firstSubmission).not.toBeNull();

    // Try to submit the same task again with a different file
    const fileData2 = {
      ...fileData,
      upload_name: "test_already_submitted_submission_2.pdf",
      random_name: "random_already_submitted_submission_file_2.pdf",
      size: 91234,
    };
    const createdFileSecond = fileRepo.create(fileData2);
    expect(createdFileSecond).toBeGreaterThan(0);

    expect(() => {
      taskService.submitTask(
        createdPost!.id!,
        createdMahasiswa!.id!,
        createdClass!.id!,
        createdFileSecond as number,
      );
    }).toThrow("Task already submitted.");
  });
});
