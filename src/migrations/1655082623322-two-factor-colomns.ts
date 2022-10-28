import {MigrationInterface, QueryRunner} from "typeorm";

export class twoFactorColomns1655082623322 implements MigrationInterface {
    name = 'twoFactorColomns1655082623322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_two_fa_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "two_fa_secret" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "two_fa_secret"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_two_fa_enabled"`);
    }

}
