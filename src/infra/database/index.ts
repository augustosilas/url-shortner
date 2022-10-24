import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
import dbConfig from "./ormconfig.js";

export class PostgresDataSource {
  private static instance: PostgresDataSource;

  private postgresDataSource: DataSource;

  private constructor() {
    this.postgresDataSource = new DataSource(dbConfig);
  }

  static getInstance() {
    if (PostgresDataSource.instance) return PostgresDataSource.instance;
    PostgresDataSource.instance = new PostgresDataSource();
    return PostgresDataSource.instance;
  }

  async initialize() {
    this.postgresDataSource
      .initialize()
      .then(() => console.log("Data source has been initialized"))
      .catch((error) =>
        console.log("Error during Data Source Initialization", error)
      );
  }

  getRepository(repository: EntityTarget<ObjectLiteral>) {
    if (!repository) throw new Error("Invalid repository");
    return this.postgresDataSource.getRepository(repository);
  }

  getDataSource() {
    return this.postgresDataSource;
  }
}
