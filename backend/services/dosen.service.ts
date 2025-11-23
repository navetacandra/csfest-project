import { DosenRepository } from "../repositories/dosen.repository";
import type { Dosen } from "../models/dosen.model";
import { Password } from "./password.service";
import { Sqlite } from "../config/database";

export class DosenService {
  private dosenRepository: DosenRepository;

  constructor(sqlite: Sqlite) {
    this.dosenRepository = new DosenRepository(sqlite);
  }

  async create(
    data: Omit<Dosen, "id" | "created_at" | "updated_at" | "password"> & {
      password: string;
      username?: string;
    },
  ) {
    const hashedPassword = await Password.hash(data.password);

    const newDosenData: Omit<
      Dosen,
      "id" | "created_at" | "updated_at" | "password"
    > & { password: string } = {
      ...data,
      username: data.username || data.nip,
      password: hashedPassword,
    };

    const newDosenId = this.dosenRepository.create(newDosenData);
    return this.dosenRepository.findById(Number(newDosenId));
  }

  getAll(page: number, limit: number, nip?: string, name?: string) {
    return this.dosenRepository.all(page, limit, nip, name);
  }

  getById(id: number) {
    const dosen = this.dosenRepository.findById(id);
    if (!dosen) {
      throw new Error("Dosen not found");
    }
    return dosen;
  }

  async update(id: number, data: Partial<{ nip: string; name: string }>) {
    this.dosenRepository.update(id, data);
    return this.dosenRepository.findById(id);
  }

  delete(id: number) {
    const dosen = this.dosenRepository.findById(id);
    if (!dosen) {
      throw new Error("Dosen not found");
    }
    this.dosenRepository.delete(id);
    return dosen;
  }
}
