import { MigrationInterface, QueryRunner } from "typeorm";

export class Tags1749994885446 implements MigrationInterface {
    name = 'Tags1749994885446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_tags" ("pollId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_ee558276b3ba019399ddede703b" PRIMARY KEY ("pollId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_110e5cc2c3af2d8423db6f470f" ON "poll_tags" ("pollId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4a50d295c21756f43717dbf05" ON "poll_tags" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "poll_tags" ADD CONSTRAINT "FK_110e5cc2c3af2d8423db6f470fc" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "poll_tags" ADD CONSTRAINT "FK_a4a50d295c21756f43717dbf05e" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poll_tags" DROP CONSTRAINT "FK_a4a50d295c21756f43717dbf05e"`);
        await queryRunner.query(`ALTER TABLE "poll_tags" DROP CONSTRAINT "FK_110e5cc2c3af2d8423db6f470fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4a50d295c21756f43717dbf05"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_110e5cc2c3af2d8423db6f470f"`);
        await queryRunner.query(`DROP TABLE "poll_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
