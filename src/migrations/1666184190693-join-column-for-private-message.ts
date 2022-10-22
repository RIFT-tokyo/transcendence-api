import {MigrationInterface, QueryRunner} from "typeorm";

export class joinColumnForPrivateMessage1666184190693 implements MigrationInterface {
    name = 'joinColumnForPrivateMessage1666184190693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_message_user" ADD "fromUserId" integer`);
        await queryRunner.query(`ALTER TABLE "private_message_user" ADD CONSTRAINT "UQ_0ecd68e46ee1e99d0e6acccbefb" UNIQUE ("fromUserId")`);
        await queryRunner.query(`ALTER TABLE "private_message" ADD "messageId" integer`);
        await queryRunner.query(`ALTER TABLE "private_message" ADD CONSTRAINT "UQ_93edd2f64d70ff2142eda8cc169" UNIQUE ("messageId")`);
        await queryRunner.query(`ALTER TABLE "private_message_user" ADD CONSTRAINT "FK_0ecd68e46ee1e99d0e6acccbefb" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "private_message" ADD CONSTRAINT "FK_93edd2f64d70ff2142eda8cc169" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_message" DROP CONSTRAINT "FK_93edd2f64d70ff2142eda8cc169"`);
        await queryRunner.query(`ALTER TABLE "private_message_user" DROP CONSTRAINT "FK_0ecd68e46ee1e99d0e6acccbefb"`);
        await queryRunner.query(`ALTER TABLE "private_message" DROP CONSTRAINT "UQ_93edd2f64d70ff2142eda8cc169"`);
        await queryRunner.query(`ALTER TABLE "private_message" DROP COLUMN "messageId"`);
        await queryRunner.query(`ALTER TABLE "private_message_user" DROP CONSTRAINT "UQ_0ecd68e46ee1e99d0e6acccbefb"`);
        await queryRunner.query(`ALTER TABLE "private_message_user" DROP COLUMN "fromUserId"`);
    }

}
