import { sqlite } from "..";
import type { Admin } from "../models/admin.model";
import type { Dosen } from "../models/dosen.model";
import type { Mahasiswa } from "../models/mahasiswa.model";

export class UserRepository {
  findByUsername(username: string) {
    const mahasiswaQuery = "SELECT * FROM mahasiswa WHERE username = ?";
    let mResult = sqlite.query(mahasiswaQuery, [username]) as Mahasiswa[];
    if (mResult.length > 0) {
      return { ...mResult[0], role: "mahasiswa" as const };
    }

    const dosenQuery = "SELECT * FROM dosen WHERE username = ?";
    let dResult = sqlite.query(dosenQuery, [username]) as Dosen[];
    if (dResult.length > 0) {
      return { ...dResult[0], role: "dosen" as const };
    }

    const adminQuery = "SELECT * FROM admin WHERE username = ?";
    let aResult = sqlite.query(adminQuery, [username]) as Admin[];
    if (aResult.length > 0) {
      return { ...aResult[0], role: "admin" as const };
    }

    return null;
  }

  findById(id: number, role: "mahasiswa" | "dosen" | "admin") {
    let query: string;
    let result: any[];

    switch (role) {
              case "mahasiswa":
                  query =
                    "SELECT id, username, name, nim, study_program_id, created_at, updated_at FROM mahasiswa WHERE id = ?";
                  result = sqlite.query(query, [id]);
                  break;      case "dosen":
        query =
          "SELECT id, username, name, created_at, updated_at FROM dosen WHERE id = ?";
        result = sqlite.query(query, [id]);
        break;
      case "admin":
        query =
          "SELECT id, username, name, created_at, updated_at FROM admin WHERE id = ?";
        result = sqlite.query(query, [id]);
        break;
    }

    if (result.length > 0) {
      return { ...result[0], role: role };
    }

    return null;
  }
}
