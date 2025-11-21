import { Database } from "bun:sqlite";

function resolve(path: string): string {
  return Bun.fileURLToPath(import.meta.resolve(path));
}

export class Sqlite {
  protected database_path: string;
  protected db: Database;

  constructor(filename: string = "database.sqlite") {
    this.database_path = resolve(`${__dirname}/../database/${filename}`);
    const isFirstRun = Bun.file(this.database_path).size == 0; // no data or not exists

    this.db = new Database(this.database_path, {
      create: true,
      readwrite: true,
    });

    if (isFirstRun) {
      try {
        const migrationFiles = Array.from(
          new Bun.Glob("*.sql").scanSync({
            onlyFiles: true,
            followSymlinks: false,
            absolute: true,
            cwd: resolve(`${__dirname}/../database/migrations`),
          }),
        )
          .sort()
          .map((path) => Bun.file(path).text());
        const seedFiles = Array.from(
          new Bun.Glob("*.sql").scanSync({
            onlyFiles: true,
            followSymlinks: false,
            absolute: true,
            cwd: resolve(`${__dirname}/../database/seeds`),
          }),
        )
          .sort()
          .map((path) => Bun.file(path).text());

        this.db.query("PRAGMA journal_mode = WAL;");

        const initialQueries = [...migrationFiles, ...seedFiles];
        const execute = this.db.transaction(async (sqls: Promise<string>[]) => {
          for (const sql of sqls) this.db.run(await sql);
        });
        execute(initialQueries);
      } catch (err) {
        Bun.file(this.database_path).delete(); // remove failed database
        console.error(`Failed to migrate\nError: `, err);
        throw err;
      } finally {
        Bun.gc(); // trigger gc to clean-up
      }
    }
  }

  query(sql: string, ...args: any) {
    try {
      const stmt = this.db.prepare(sql);
      const transaction = this.db.transaction(() => stmt.all(...args));
      return transaction();
    } catch (err) {
      console.error(`Failed to execute query: ${sql}\nError: `, err);
      throw err;
    }
  }
}
