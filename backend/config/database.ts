import { resolve as pathResolve } from "node:path";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { Database } from "bun:sqlite";

export class Sqlite {
  protected database_path: string;
  protected db: Database;

  constructor(filename: string = "database.sqlite") {
    this.database_path = pathResolve(`${__dirname}/../database/${filename}`);

    const isFirstRun = !existsSync(this.database_path);

    this.db = new Database(this.database_path, {
      create: true,
      readwrite: true,
    });

    if (isFirstRun) {
      try {
        const initialQuery = readFileSync(
          pathResolve(`${__dirname}/../database/migration.sql`),
          "utf8",
        );

        this.db.run("PRAGMA journal_mode = WAL;");
        this.query(initialQuery);
      } catch (err) {
        rmSync(this.database_path); // remove failed database
        console.error(`Failed to migrate\nError: `, err);
        throw err;
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
