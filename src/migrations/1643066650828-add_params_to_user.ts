import {MigrationInterface, QueryRunner} from "typeorm";

export class addParamsToUser1643066650828 implements MigrationInterface {
    name = 'addParamsToUser1643066650828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "display_name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_image" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'offline'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status_message"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_image"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "display_name"`);
    }

}
