import type { Admin } from "../models/admin.model";
import type { Dosen } from "../models/dosen.model";
import type { Mahasiswa } from "../models/mahasiswa.model";
import type { Sqlite } from "../config/database";

export class UserRepository {
  private db: Sqlite;

  constructor(db: Sqlite) {
    this.db = db;
  }

  findByUsername(
    username: string,
  ):
    | ({ role: "mahasiswa" } & Mahasiswa)
    | ({ role: "dosen" } & Dosen)
    | ({ role: "admin" } & Admin)
    | null {
    const mahasiswaQuery = "SELECT * FROM mahasiswa WHERE username = ?";
    let mResult = this.db.query(mahasiswaQuery, username) as Mahasiswa[];
    if (mResult.length > 0) {
      return { ...mResult[0], role: "mahasiswa" as const } as {
        role: "mahasiswa";
      } & Mahasiswa;
    }

    const dosenQuery = "SELECT * FROM dosen WHERE username = ?";
    let dResult = this.db.query(dosenQuery, username) as Dosen[];
    if (dResult.length > 0) {
      return { ...dResult[0], role: "dosen" as const } as {
        role: "dosen";
      } & Dosen;
    }

    const adminQuery = "SELECT * FROM admin WHERE username = ?";
    let aResult = this.db.query(adminQuery, username) as Admin[];
    if (aResult.length > 0) {
      return { ...aResult[0], role: "admin" as const } as {
        role: "admin";
      } & Admin;
    }

    return null;
  }

  findById(
    id: number,
    role: "mahasiswa" | "dosen" | "admin",
  ):
    | ({ role: "mahasiswa" | "dosen" | "admin" } & (Mahasiswa | Dosen | Admin))
    | null {
    let query: string;
    let result: any[];

    switch (role) {
      case "mahasiswa":
        query =
          "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa WHERE id = ?";
        result = this.db.query(query, id);
        break;
      case "dosen":
        query =
          "SELECT id, username, name, created_at, updated_at FROM dosen WHERE id = ?";
        result = this.db.query(query, id);
        break;
      case "admin":
        query =
          "SELECT id, username, name, created_at, updated_at FROM admin WHERE id = ?";
        result = this.db.query(query, id);
        break;
    }

    if (result.length > 0) {
      return { ...result[0], role: role };
    }

    return null;
  }
}
