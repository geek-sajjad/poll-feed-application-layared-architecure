import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1749743323548 implements MigrationInterface {
  name = 'User1749743323548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    // await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "options"`);
    // await queryRunner.query(`ALTER TABLE "polls" ADD "options" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "options"`);
    // await queryRunner.query(`ALTER TABLE "polls" ADD "options" character varying array NOT NULL`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
