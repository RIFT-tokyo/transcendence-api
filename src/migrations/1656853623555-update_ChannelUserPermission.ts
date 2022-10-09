import {MigrationInterface, QueryRunner} from "typeorm";

export class updateChannelUserPermission1656853623555 implements MigrationInterface {
    name = 'updateChannelUserPermission1656853623555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_user_permission" ADD "ban_until" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_user_permission" DROP COLUMN "ban_until"`);
    }

}
