import { MajorRepository } from "../repositories/major.repository";
import type { Major } from "../models/major.model";
import { Sqlite } from "../config/database";

export class MajorService {
  private majorRepository: MajorRepository;

  constructor(sqlite: Sqlite) {
    this.majorRepository = new MajorRepository(sqlite);
  }

  getAll() {
    return this.majorRepository.all();
  }

  getById(id: number) {
    const major = this.majorRepository.findById(id);
    if (!major) {
      throw new Error("Major not found");
    }
    return major;
  }

  create(data: Omit<Major, "id" | "created_at" | "updated_at">) {
    const newMajorId = this.majorRepository.create(data);
    return this.majorRepository.findById(Number(newMajorId));
  }

  update(
    id: number,
    data: Partial<Omit<Major, "id" | "created_at" | "updated_at">>,
  ) {
    this.majorRepository.update(id, data);
    return this.majorRepository.findById(id);
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
