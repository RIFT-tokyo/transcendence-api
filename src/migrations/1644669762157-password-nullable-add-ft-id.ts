import { MigrationInterface, QueryRunner } from 'typeorm';

export class passwordNullableAddFtId1644669762157
  implements MigrationInterface
{
  name = 'passwordNullableAddFtId1644669762157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "ft_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_c8491296fbf8b61444cdc19bc6d" UNIQUE ("ft_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_c8491296fbf8b61444cdc19bc6d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ft_id"`);
  }
}
