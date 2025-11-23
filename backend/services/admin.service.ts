import { AdminRepository } from "../repositories/admin.repository";
import type { Admin } from "../models/admin.model";
import { Password } from "./password.service";
import type { Sqlite } from "../config/database";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(sqlite: Sqlite) {
    this.adminRepository = new AdminRepository(sqlite);
  }

  async create(data: Omit<Admin, "id" | "created_at" | "updated_at">): Promise<Admin | null> {
    if (!data.password) {
      throw new Error("Password is required to create a new admin.");
    }
    const hashedPassword = await Password.hash(data.password);
    const newData = { ...data, password: hashedPassword };

    const newAdminId = this.adminRepository.create(newData);
    return this.adminRepository.findById(Number(newAdminId));
  }

  getAll(page: number, limit: number, name?: string): Admin[] {
    return this.adminRepository.all(page, limit);
  }

  getById(id: number): Admin {
    const admin = this.adminRepository.findById(id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  }

  async update(
    id: number,
    data: Partial<Omit<Admin, "id" | "created_at" | "updated_at">>,
  ): Promise<Admin | null> {
    if (data.password) {
      data.password = await Password.hash(data.password);
    }
    this.adminRepository.update(id, data);
    return this.adminRepository.findById(id);
  }

  delete(id: number): Admin {
    const admin = this.adminRepository.findById(id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    this.adminRepository.delete(id);
    return admin;
  }
}
