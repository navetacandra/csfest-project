import { TaskRepository } from "../repositories/task.repository";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import { PostRepository } from "../repositories/post.repository";
import type { Task } from "../models/task.model";
import { Sqlite } from "../config/database";

interface TaskItem {
  id: number;
  class_id: number;
  title: string;
  status: "completed" | "incoming";
}

export class TaskService {
  private taskRepository: TaskRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;
  private postRepository: PostRepository;

  constructor(sqlite: Sqlite) {
    this.taskRepository = new TaskRepository(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
    this.postRepository = new PostRepository(sqlite);
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

  getTasks(studentId: number, filter: "all" | "completed" | "incoming"): TaskItem[] {
    const studentEnrollments =
      this.classEnrollmentRepository.findByMahasiswaId(studentId);
    const classIds = studentEnrollments.map((e) => e.class_id);

    const posts = this.postRepository.findTasksByClassIds(classIds);
    const submittedTasks = this.taskRepository.findByStudentId(studentId);

    const result: TaskItem[] = [];
    for (const post of posts) {
      const submission = submittedTasks.find((t) => t.post_id === post.id);
      const status = submission ? "completed" : "incoming";

      if (filter === "all" || filter === status) {
        result.push({
          id: post.id,
          class_id: post.class_id,
          title: post.message,
          status: status,
        });
      }
    }
    return result;
  }
}
