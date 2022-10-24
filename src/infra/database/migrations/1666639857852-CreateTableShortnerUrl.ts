import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableShortnerUrl1666639857852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "shortner-url",
        columns: [
          {
            name: "id",
            type: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "hash",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "original_url",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "expires_in",
            type: "varchar",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("shortner-url");
  }
}
