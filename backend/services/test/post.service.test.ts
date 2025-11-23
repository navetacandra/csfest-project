import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { PostService } from "../post.service";
import { Sqlite } from "../../config/database";
import { ClassService } from "../class.service";
import { ClassEnrollmentRepository } from "../../repositories/classEnrollment.repository";
import { FileRepository } from "../../repositories/file.repository";
import { MahasiswaService } from "../mahasiswa.service";
import type { Post } from "../../models/post.model";

describe("PostService", () => {
  const DB_TEST = `post_service_test.db`;
  let sqlite: Sqlite;
  let postService: PostService;
  let classService: ClassService;
  let classEnrollmentRepo: ClassEnrollmentRepository;
  let fileRepo: FileRepository;
  let mahasiswaService: MahasiswaService;

  beforeAll(async () => {
    sqlite = await Sqlite.createInstance(DB_TEST);
    postService = new PostService(sqlite);
    classService = new ClassService(sqlite);
    classEnrollmentRepo = new ClassEnrollmentRepository(sqlite);
    fileRepo = new FileRepository(sqlite);
    mahasiswaService = new MahasiswaService(sqlite);
  });

  afterAll(() => {
    const dbPath = Bun.fileURLToPath(
      import.meta.resolve(`${__dirname}/../../database/${DB_TEST}`),
    );
    sqlite.close();
    Bun.file(dbPath).delete();
  });

  test("should create a post", async () => {
    const classData = {
      name: "Test Class for Post Service",
      schedule: 1,
      start_time: "09:00",
      end_time: "11:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();
    expect(createdClass?.id).toBeGreaterThan(0);

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "9876543210",
      name: "Test Mahasiswa Post Service",
      email: "test.post.service@example.com",
      username: "test_post_service_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();
    expect(createdMahasiswa?.id).toBeGreaterThan(0);

    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_post_file.pdf",
      random_name: "random_post_test_file.pdf",
      size: 12345,
      mimetype: "application/pdf",
    };
    const createdFile = fileRepo.create(fileData);
    expect(createdFile).toBeGreaterThan(0);

    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: createdFile as number,
      message: "Integration Test Post Service",
      type: "post",
    };

    const result = postService.create(postData);

    expect(result).not.toBeNull();
    expect(result?.message).toBe(postData.message);
    expect(result?.type).toBe(postData.type);
  });

  test("should get a post by id", async () => {
    const classData = {
      name: "Test Class Get By ID for Post Service",
      schedule: 2,
      start_time: "10:00",
      end_time: "12:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "9876543211",
      name: "Test Mahasiswa Get By ID Post Service",
      email: "test.getbyid.post.service@example.com",
      username: "test_getbyid_post_service_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_getbyid_file.pdf",
      random_name: "random_getbyid_test_file.pdf",
      size: 23456,
      mimetype: "application/pdf",
    };
    const createdFile = fileRepo.create(fileData);
    expect(createdFile).toBeGreaterThan(0);

    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: createdFile as number,
      message: "Get By ID Test Post Service",
      type: "post",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    const result = postService.getById(createdPost!.id!);

    expect(result).not.toBeNull();
    expect(result.id).toBe(createdPost!.id);
    expect(result.message).toBe(postData.message);
  });

  test("should update a post", async () => {
    const classData = {
      name: "Test Class Update for Post Service",
      schedule: 3,
      start_time: "11:00",
      end_time: "13:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "9876543212",
      name: "Test Mahasiswa Update Post Service",
      email: "test.update.post.service@example.com",
      username: "test_update_post_service_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_update_file.pdf",
      random_name: "random_update_test_file.pdf",
      size: 34567,
      mimetype: "application/pdf",
    };
    const createdFile = fileRepo.create(fileData);
    expect(createdFile).toBeGreaterThan(0);

    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: createdFile as number,
      message: "Update Test Post Service",
      type: "post",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    const updateData = { message: "Updated Integration Test Post Service" };
    const updatedPost = postService.update(createdPost!.id!, updateData);

    expect(updatedPost).not.toBeNull();
    expect(updatedPost?.message).toBe(updateData.message);
  });

  test("should delete a post", async () => {
    const classData = {
      name: "Test Class Delete for Post Service",
      schedule: 4,
      start_time: "13:00",
      end_time: "15:00",
    };
    const createdClass = classService.create(classData);
    expect(createdClass).not.toBeNull();

    const mahasiswaData = {
      major_id: 1,
      study_program_id: 1,
      nim: "9876543213",
      name: "Test Mahasiswa Delete Post Service",
      email: "test.delete.post.service@example.com",
      username: "test_delete_post_service_mhs",
      password: "password123",
    };
    const createdMahasiswa = await mahasiswaService.create(mahasiswaData);
    expect(createdMahasiswa).not.toBeNull();

    const enrolledClass = classService.enroll(
      createdClass?.enroll_key!,
      createdMahasiswa!.id!,
      "mahasiswa",
    );
    expect(enrolledClass).not.toBeNull();

    const enrollments = classEnrollmentRepo.findByMahasiswaId(
      createdMahasiswa!.id!,
    );
    const enrollment = enrollments.find((e) => e.class_id === createdClass!.id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBeGreaterThan(0);

    const fileData = {
      mahasiswa_id: createdMahasiswa!.id!,
      dosen_id: null,
      upload_name: "test_delete_file.pdf",
      random_name: "random_delete_test_file.pdf",
      size: 45678,
      mimetype: "application/pdf",
    };
    const createdFile = fileRepo.create(fileData);
    expect(createdFile).toBeGreaterThan(0);

    const postData: Omit<Post, "id" | "created_at" | "updated_at"> = {
      class_id: createdClass!.id!,
      class_enrollment_id: enrollment!.id!,
      file_id: createdFile as number,
      message: "Delete Test Post Service",
      type: "post",
    };
    const createdPost = postService.create(postData);
    expect(createdPost).not.toBeNull();

    const postBeforeDelete = postService.getById(createdPost!.id!);
    expect(postBeforeDelete).not.toBeNull();

    const deletedPost = postService.delete(createdPost!.id!);

    expect(deletedPost).not.toBeNull();
    expect(deletedPost.id).toBe(createdPost!.id);

    expect(() => {
      postService.getById(createdPost!.id!);
    }).toThrow("Post not found");
  });

  test("should throw error when getting non-existent post by id", () => {
    expect(() => {
      postService.getById(999999);
    }).toThrow("Post not found");
  });

  test("should throw error when deleting non-existent post", () => {
    expect(() => {
      postService.delete(999999);
    }).toThrow("Post not found");
  });
});
