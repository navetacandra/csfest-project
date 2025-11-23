import { ClassRepository } from '../repositories/class.repository';
import { ClassEnrollmentRepository } from '../repositories/classEnrollment.repository';
import { PostRepository } from '../repositories/post.repository';
import type { Class } from '../models/class.model';
import { randomBytes } from 'crypto';

export class ClassService {
  private classRepository: ClassRepository;
  private classEnrollmentRepository: ClassEnrollmentRepository;
  private postRepository: PostRepository;

  constructor() {
    this.classRepository = new ClassRepository();
    this.classEnrollmentRepository = new ClassEnrollmentRepository();
    this.postRepository = new PostRepository();
  }

  create(data: Omit<Class, 'id' | 'created_at' | 'updated_at' | 'actived_at' | 'enroll_key'>) {
    const enrollKey = randomBytes(4).toString('hex').toUpperCase();
    const newClassId = this.classRepository.create(data, enrollKey);
    return this.classRepository.findById(Number(newClassId));
  }
  
  enroll(enroll_key: string, userId: number, role: 'mahasiswa' | 'dosen') {
    const classToEnroll = this.classRepository.findByEnrollKey(enroll_key);
    if (!classToEnroll) {
        throw new Error("Class with that enroll key not found.");
    }

    // Check if already enrolled
    const enrollments = role === 'mahasiswa'
        ? this.classEnrollmentRepository.findByMahasiswaId(userId)
        : this.classEnrollmentRepository.findByDosenId(userId);
    
    if (enrollments.some(e => e.class_id === classToEnroll.id)) {
        throw new Error("Already enrolled in this class.");
    }
    
    // Create enrollment
    const enrollmentData = {
        class_id: classToEnroll.id,
        mahasiswa_id: role === 'mahasiswa' ? userId : null,
        dosen_id: role === 'dosen' ? userId : null,
        admin_id: null
    };
    
    this.classEnrollmentRepository.create(enrollmentData);
    
    return classToEnroll;
  }

  getFollowedClasses(userId: number, role: 'mahasiswa' | 'dosen' | 'admin') {
      let enrollments;
      if (role === 'admin') {
          // The brief doesn't specify pagination, so we return all.
          // A proper implementation might need pagination here.
          const allClasses = this.classRepository.all(1, 1000); // A high limit to get all
          return allClasses;
      } else if (role === 'mahasiswa') {
          enrollments = this.classEnrollmentRepository.findByMahasiswaId(userId);
      } else { // dosen
          enrollments = this.classEnrollmentRepository.findByDosenId(userId);
      }
      
      const classIds = enrollments.map(e => e.class_id);
      return this.classRepository.findByIds(classIds);
  }
  
  getClassDetails(classId: number) {
      const classData = this.classRepository.findById(classId);
      if (!classData) {
          throw new Error("Class not found");
      }
      const posts = this.postRepository.findByClassId(classId);
      return { ...classData, posts: posts.map(p => ({ id: p.id, message: p.message, type: p.type })) };
  }
}
