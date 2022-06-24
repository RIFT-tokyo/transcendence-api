import {MigrationInterface, QueryRunner} from "typeorm";

export class removeRole1656064268807 implements MigrationInterface {
    name = 'removeRole1656064268807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_a53325430eaca5aa440b9336e08"`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" DROP COLUMN "ban_until"`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" ADD "role" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_user_permission" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" ADD "roleId" integer`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" ADD "ban_until" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_a53325430eaca5aa440b9336e08" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
