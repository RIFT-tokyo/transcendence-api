import {MigrationInterface, QueryRunner} from "typeorm";

export class addCreatedAndUpdatedAtToMatch1666961026492 implements MigrationInterface {
    name = 'addCreatedAndUpdatedAtToMatch1666961026492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "start_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "end_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "end_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "start_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "create_at"`);
    }

}
