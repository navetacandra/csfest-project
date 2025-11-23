import { MajorRepository } from '../repositories/major.repository';
import type { Major } from '../models/major.model';

export class MajorService {
  private majorRepository: MajorRepository;

  constructor() {
    this.majorRepository = new MajorRepository();
  }

  getAll() {
    return this.majorRepository.all();
  }

  create(data: Omit<Major, 'id' | 'created_at' | 'updated_at'>) {
    const newMajorId = this.majorRepository.create(data);
    return this.majorRepository.findById(Number(newMajorId));
  }

  delete(id: number) {
    const major = this.majorRepository.findById(id);
    if (!major) {
      throw new Error("Major not found");
    }
    this.majorRepository.delete(id);
    return major;
  }
}
