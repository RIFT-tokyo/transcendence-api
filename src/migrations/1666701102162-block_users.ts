import {MigrationInterface, QueryRunner} from "typeorm";

export class blockUsers1666701102162 implements MigrationInterface {
    name = 'blockUsers1666701102162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_block_users_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_6454035210e866dd5c4609d279c" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_60fc61be72dde6a34696c75eac" ON "user_block_users_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d2281e6b0df7a6016c9535986" ON "user_block_users_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "user_block_users_user" ADD CONSTRAINT "FK_60fc61be72dde6a34696c75eac0" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_block_users_user" ADD CONSTRAINT "FK_9d2281e6b0df7a6016c9535986b" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_block_users_user" DROP CONSTRAINT "FK_9d2281e6b0df7a6016c9535986b"`);
        await queryRunner.query(`ALTER TABLE "user_block_users_user" DROP CONSTRAINT "FK_60fc61be72dde6a34696c75eac0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d2281e6b0df7a6016c9535986"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60fc61be72dde6a34696c75eac"`);
        await queryRunner.query(`DROP TABLE "user_block_users_user"`);
    }

}
