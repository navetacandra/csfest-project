import { ClassRepository } from "../repositories/class.repository";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import { PostRepository } from "../repositories/post.repository";
import type { Class } from "../models/class.model";
import { randomBytes } from "node:crypto";
import { Sqlite } from "../config/database";
import { MahasiswaRepository } from "../repositories/mahasiswa.repository";

export interface ClassDetails {
  id: number;
  name: string;
  enroll_key: string;
  schedule: number;
  start_time: string;
  end_time: string;
  activated_at: string;
  created_at: string;
  updated_at: string;
  posts: {
    id: number;
    message: string;
    type: string;
  }[];
  members: {
    name: string;
    nim: string;
  }[];
}

export class ClassService {
  private classRepository: ClassRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;
  private postRepository: PostRepository;
  private mahasiswaRepository: MahasiswaRepository;

  constructor(sqlite: Sqlite) {
    this.classRepository = new ClassRepository(sqlite);
    this.mahasiswaRepository = new MahasiswaRepository(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
    this.postRepository = new PostRepository(sqlite);
  }

  create(
    data: Omit<
      Class,
      "id" | "created_at" | "updated_at" | "activated_at" | "enroll_key"
    >,
  ): Class | null {
    const enrollKey = randomBytes(4).toString("hex").toUpperCase();
    const newClassId = this.classRepository.create(data, enrollKey);
    return this.classRepository.findById(Number(newClassId));
  }

  createWithActivationDate(
    data: Omit<
      Class,
      "id" | "created_at" | "updated_at" | "enroll_key"
    >
  ): Class | null {
    const enrollKey = randomBytes(4).toString("hex").toUpperCase();
    const newClassId = this.classRepository.createWithActivationDate(data, enrollKey);
    return this.classRepository.findById(Number(newClassId));
  }

  enroll(
    enroll_key: string,
    userId: number,
    role: "mahasiswa" | "dosen",
  ): Class | null {
    const classToEnroll = this.classRepository.findByEnrollKey(enroll_key);
    if (!classToEnroll) {
      throw new Error("Class with that enroll key not found.");
    }

    const enrollments =
      role === "mahasiswa"
        ? this.classEnrollmentRepository.findByMahasiswaId(userId)
        : this.classEnrollmentRepository.findByDosenId(userId);

    if (enrollments.some((e) => e.class_id === classToEnroll.id)) {
      throw new Error("Already enrolled in this class.");
    }

    const enrollmentData = {
      class_id: classToEnroll.id,
      mahasiswa_id: role === "mahasiswa" ? userId : null,
      dosen_id: role === "dosen" ? userId : null,
      admin_id: null,
    };

    this.classEnrollmentRepository.create(enrollmentData);

    return classToEnroll;
  }

  getFollowedClasses(
    userId: number,
    role: "mahasiswa" | "dosen" | "admin",
  ): Class[] {
    let enrollments;
    if (role === "admin") {
      const allClasses = this.classRepository.all(1, 1000);
      return allClasses;
    } else if (role === "mahasiswa") {
      enrollments = this.classEnrollmentRepository.findByMahasiswaId(userId);
    } else {
      enrollments = this.classEnrollmentRepository.findByDosenId(userId);
    }

    const classIds = enrollments.map((e) => e.class_id);
    return this.classRepository.findByIds(classIds);
  }

  getSchedule(
    userId: number,
    role: "mahasiswa" | "dosen" | "admin",
    day?: number,
  ): Class[] {
    let enrollments;
    if (role === "admin") {
      const allClasses = this.classRepository.all(1, 1000);
      return allClasses;
    } else if (role === "mahasiswa") {
      enrollments = this.classEnrollmentRepository.findByMahasiswaId(userId);
    } else {
      enrollments = this.classEnrollmentRepository.findByDosenId(userId);
    }

    const classIds = enrollments.map((e) => e.class_id);
    return this.classRepository.findByIds(classIds, day);
  }

  getClassDetails(classId: number): ClassDetails {
    const classData = this.classRepository.findById(classId);
    if (!classData) {
      throw new Error("Class not found");
    }
    const posts = this.postRepository.findByClassId(classId);
    const members = this.mahasiswaRepository.findByClassId(classId);
    return {
      ...classData,
      members,
      posts: posts.map((p) => ({ id: p.id, message: p.message, type: p.type })),
    };
  }
}
