import { MajorRepository } from "../repositories/major.repository";
import type { Major } from "../models/major.model";
import { Sqlite } from "../config/database";

export class MajorService {
  private majorRepository: MajorRepository;

  constructor(sqlite: Sqlite) {
    this.majorRepository = new MajorRepository(sqlite);
  }

  getAll(): Major[] {
    return this.majorRepository.all();
  }

  getById(id: number): Major {
    const major = this.majorRepository.findById(id);
    if (!major) {
      throw new Error("Major not found");
    }
    return major;
  }

  create(data: Omit<Major, "id" | "created_at" | "updated_at">): Major | null {
    const newMajorId = this.majorRepository.create(data);
    return this.majorRepository.findById(Number(newMajorId));
  }

  update(
    id: number,
    data: Partial<Omit<Major, "id" | "created_at" | "updated_at">>,
  ): Major | null {
    this.majorRepository.update(id, data);
    return this.majorRepository.findById(id);
  }

  delete(id: number): Major {
    const major = this.majorRepository.findById(id);
    if (!major) {
      throw new Error("Major not found");
    }
    this.majorRepository.delete(id);
    return major;
  }
}
