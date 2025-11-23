import { StudyProgramRepository } from '../repositories/studyProgram.repository';
import type { StudyProgram } from '../models/study_program.model';

export class StudyProgramService {
  private studyProgramRepository: StudyProgramRepository;

  constructor() {
    this.studyProgramRepository = new StudyProgramRepository();
  }

  getByMajorId(majorId: number) {
    return this.studyProgramRepository.findByMajorId(majorId);
  }
  
  create(data: Omit<StudyProgram, 'id' | 'created_at' | 'updated_at'>) {
    const newStudyProgramId = this.studyProgramRepository.create(data);
    return this.studyProgramRepository.findById(Number(newStudyProgramId));
  }

  delete(id: number) {
    const studyProgram = this.studyProgramRepository.findById(id);
    if (!studyProgram) {
      throw new Error("Study Program not found");
    }
    this.studyProgramRepository.delete(id);
    return studyProgram;
  }
}
