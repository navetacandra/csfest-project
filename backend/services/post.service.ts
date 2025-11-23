import { PostRepository } from '../repositories/post.repository';
import type { Post } from '../models/post.model';
import { TaskRepository } from '../repositories/task.repository';
import { FileRepository } from '../repositories/file.repository';

export class PostService {
  private postRepository: PostRepository;
  private taskRepository: TaskRepository;
  private fileRepository: FileRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.taskRepository = new TaskRepository();
    this.fileRepository = new FileRepository();
  }

  create(data: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    const newPostId = this.postRepository.create(data);
    return this.postRepository.findById(Number(newPostId));
  }

  getById(id: number, accessor?: { role: 'dosen' } | { role: 'mahasiswa', studentId: number }) {
    const post = this.postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    let file = null;
    if (post.file_id) {
        file = this.fileRepository.findById(post.file_id);
    }
    
    if (accessor?.role === 'mahasiswa' && post.type === 'task') {
        const tasks = this.taskRepository.findByPostIdAndStudentId(id, accessor.studentId);
        return { ...post, file, task: tasks[0] || null };
    }
    
    if (accessor?.role === 'dosen' && post.type === 'task') {
        const tasks = this.taskRepository.findByPostIdWithStudent(id);
        return { ...post, file, tasks };
    }

    return { ...post, file };
  }

  delete(id: number) {
    const post = this.postRepository.findById(id);
    if (!post) {
        throw new Error("Post not found");
    }
    this.postRepository.delete(id);
    return post;
  }
  
  update(id: number, data: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>) {
      this.postRepository.update(id, data);
      return this.postRepository.findById(id);
  }
}
