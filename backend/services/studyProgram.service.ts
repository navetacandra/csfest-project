import { StudyProgramRepository } from '../repositories/studyProgram.repository';
import type { StudyProgram } from '../models/study_program.model';
import { Sqlite } from '../config/database';

export class StudyProgramService {
  private studyProgramRepository: StudyProgramRepository;

  constructor(sqlite?: Sqlite) {
    this.studyProgramRepository = new StudyProgramRepository(sqlite);
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
