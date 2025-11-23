import { Database } from "bun:sqlite";

function resolve(path: string): string {
  return Bun.fileURLToPath(import.meta.resolve(path));
}

function getDatabaseFiles(type: "migrations" | "seeds"): Promise<string>[] {
  return Array.from(
    new Bun.Glob("*.sql").scanSync({
      onlyFiles: true,
      followSymlinks: false,
      absolute: true,
      cwd: resolve(`${__dirname}/../database/${type}`),
    }),
  )
    .sort()
    .map((path) => Bun.file(path).text());
}

export class Sqlite {
  protected database_path: string;
  protected db: Database;
  private firstRun: boolean;

  static async createInstance(filename: string = "sqlite.db"): Promise<Sqlite> {
    const sqlite = new Sqlite(filename);

    if (!sqlite.firstRun) return sqlite;

    try {
      const initialQueries = [
        ...getDatabaseFiles("migrations"),
        ...getDatabaseFiles("seeds"),
      ];
      (await Promise.all(initialQueries)).forEach((sql) => sqlite.query(sql));
    } catch (err) {
      throw err;
    } finally {
      Bun.gc();
    }

    return sqlite;
  }

  constructor(filename: string = "sqlite.db") {
    this.database_path = resolve(`${__dirname}/../database/${filename}`);
    this.firstRun = Bun.file(this.database_path).size == 0;

    this.db = new Database(this.database_path, {
      create: true,
      readwrite: true,
    });

    if (this.firstRun) this.db.query("PRAGMA journal_mode = WAL;");
  }

  query(sql: string, ...args: any) {
    const stmt = this.db.prepare(sql);
    try {
      return stmt.all(...args);
    } catch (err) {
      console.error(`Failed to execute query: ${sql}\nError: `, err);
      throw err;
    } finally {
      stmt.finalize();
    }
  }

  close() {
    try {
      this.db.close(true);
    } catch (err) {
      throw err;
    }
  }
}

export const sqlite = await Sqlite.createInstance(Bun.env.DB_NAME);
