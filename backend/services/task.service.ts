import { TaskRepository } from "../repositories/task.repository";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import { PostRepository } from "../repositories/post.repository";
import { ClassRepository } from "../repositories/class.repository";
import type { Task } from "../models/task.model";
import { Sqlite } from "../config/database";

export interface TaskItem {
  id: number;
  class_id: number;
  class_name: string;
  title: string;
  status: "completed" | "incoming";
}

export class TaskService {
  private taskRepository: TaskRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;
  private postRepository: PostRepository;
  private classRepository: ClassRepository;

  constructor(sqlite: Sqlite) {
    this.taskRepository = new TaskRepository(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
    this.postRepository = new PostRepository(sqlite);
    this.classRepository = new ClassRepository(sqlite);
  }

  submitTask(
    postId: number,
    studentId: number,
    classId: number,
    fileId: number,
  ): Task | null {
    const enrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentId);
    const enrollment = enrollments.find((e) => e.class_id === classId);
    if (!enrollment) {
      throw new Error("Student is not enrolled in this class.");
    }

    const post = this.postRepository.findById(postId);
    if (!post || post.type !== "task") {
      throw new Error("Task post not found.");
    }

    const existingTask = this.taskRepository.findByPostIdAndStudentId(
      postId,
      studentId,
    );
    if (existingTask.length > 0) {
      throw new Error("Task already submitted.");
    }

    const taskData = {
      post_id: postId,
      class_enrollment_id: enrollment.id,
      file_id: fileId,
    };
    const newTaskId = this.taskRepository.create(taskData);
    return this.taskRepository.findById(Number(newTaskId));
  }

  getTasks(
    studentId: number,
    filter: "all" | "completed" | "incoming",
  ): TaskItem[] {
    const studentEnrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentId);
    const enrolledClassIds = studentEnrollments.map((e) => e.class_id);

    const posts = this.postRepository.findTasksByClassIds(enrolledClassIds);
    if (posts.length === 0) {
      return [];
    }
    const submittedTasks = this.taskRepository.findByStudentId(studentId);

    const postClassIds = [...new Set(posts.map((p) => p.class_id))];
    const classes = this.classRepository.findByIds(postClassIds);
    const classNameMap = new Map(classes.map((c) => [c.id, c.name]));

    const result: TaskItem[] = [];
    for (const post of posts) {
      const submission = submittedTasks.find((t) => t.post_id === post.id);
      const status = submission ? "completed" : "incoming";

      if (filter === "all" || filter === status) {
        result.push({
          id: post.id,
          class_id: post.class_id,
          class_name: classNameMap.get(post.class_id) || "",
          title: post.message,
          status: status,
        });
      }
    }
    return result;
  }
}
