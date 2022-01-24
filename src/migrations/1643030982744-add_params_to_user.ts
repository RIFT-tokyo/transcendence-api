import {MigrationInterface, QueryRunner} from "typeorm";

export class addParamsToUser1643030982744 implements MigrationInterface {
    name = 'addParamsToUser1643030982744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "display_name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_image" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status_message" character varying NOT NULL DEFAULT 'offline'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status_message"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_image"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "display_name"`);
    }

}
