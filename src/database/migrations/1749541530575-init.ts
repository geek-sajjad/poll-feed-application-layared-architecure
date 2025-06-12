import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1749541530575 implements MigrationInterface {
  name = 'Init1749541530575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "votes" ("id" SERIAL NOT NULL, "pollId" uuid NOT NULL, "userId" character varying NOT NULL, "optionIndex" smallint, "isSkip" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`
    );
    // await queryRunner.query(
    //   `CREATE INDEX "idx_votes_pollId_optionIndex" ON "votes" ("pollId", "optionIndex") `
    // );
    // await queryRunner.query(
    //   `CREATE INDEX "idx_votes_userId_createdAt" ON "votes" ("userId", "createdAt") `
    // );
    // await queryRunner.query(
    //   `CREATE UNIQUE INDEX "idx_votes_pollId_userId" ON "votes" ("pollId", "userId") `
    // );
    await queryRunner.query(
      `CREATE TABLE "polls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "options" VARCHAR[] NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id"))`
    );
    // await queryRunner.query(
    //   `CREATE INDEX "idx_polls_createdAt" ON "polls" ("createdAt") `
    // );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_2e40638d2d3b898da1af363837c" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_2e40638d2d3b898da1af363837c"`
    );
    // await queryRunner.query(`DROP INDEX "public"."idx_polls_createdAt"`);
    await queryRunner.query(`DROP TABLE "polls"`);
    // await queryRunner.query(`DROP INDEX "public"."idx_votes_pollId_userId"`);
    // await queryRunner.query(`DROP INDEX "public"."idx_votes_userId_createdAt"`);
    // await queryRunner.query(
    //   `DROP INDEX "public"."idx_votes_pollId_optionIndex"`
    // );
    await queryRunner.query(`DROP TABLE "votes"`);
  }
}
