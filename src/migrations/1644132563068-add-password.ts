import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPassword1644132563068 implements MigrationInterface {
  name = 'addPassword1644132563068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
  }
}
