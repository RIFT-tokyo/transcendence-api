import {MigrationInterface, QueryRunner} from "typeorm";

export class twoFactorColomns1655082623322 implements MigrationInterface {
    name = 'twoFactorColomns1655082623322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_ff66f23e0d7c30c7e81332aa7cc"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "UQ_ff66f23e0d7c30c7e81332aa7cc"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP COLUMN "messageId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_two_fa_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "two_fa_secret" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "two_fa_secret"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_two_fa_enabled"`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD "messageId" integer`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "UQ_ff66f23e0d7c30c7e81332aa7cc" UNIQUE ("messageId")`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_ff66f23e0d7c30c7e81332aa7cc" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
