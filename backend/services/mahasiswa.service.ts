import { MahasiswaRepository } from '../repositories/mahasiswa.repository';
import type { Mahasiswa } from '../models/mahasiswa.model';
import { Password } from './password.service';

export class MahasiswaService {
  private mahasiswaRepository: MahasiswaRepository;

  constructor() {
    this.mahasiswaRepository = new MahasiswaRepository();
  }

  async create(data: Omit<Mahasiswa, 'id' | 'created_at' | 'updated_at'>) {
    if (!data.password) {
        throw new Error("Password is required to create a new mahasiswa.");
    }
    const hashedPassword = await Password.hash(data.password);
    const newData = { ...data, password: hashedPassword };
    
    const newMahasiswaId = this.mahasiswaRepository.create(newData);
    return this.mahasiswaRepository.findById(Number(newMahasiswaId));
  }

  getAll(page: number, limit: number, name?: string, major_id?: number, study_program_id?: number) {
    return this.mahasiswaRepository.all(page, limit, name, major_id, study_program_id);
  }

  getById(id: number) {
    const mahasiswa = this.mahasiswaRepository.findById(id);
    if (!mahasiswa) {
      throw new Error("Mahasiswa not found");
    }
    return mahasiswa;
  }

  async update(id: number, data: Partial<Omit<Mahasiswa, 'id' | 'created_at' | 'updated_at'>>) {
    if (data.password) {
      data.password = await Password.hash(data.password);
    }
    this.mahasiswaRepository.update(id, data);
    return this.mahasiswaRepository.findById(id);
  }

  delete(id: number) {
    const mahasiswa = this.mahasiswaRepository.findById(id);
    if (!mahasiswa) {
      throw new Error("Mahasiswa not found");
    }
    this.mahasiswaRepository.delete(id);
    return mahasiswa;
  }
}
