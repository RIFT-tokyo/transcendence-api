import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameFtIdToIntraId1644892503712 implements MigrationInterface {
  name = 'renameFtIdToIntraId1644892503712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "ft_id" TO "intra_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_c8491296fbf8b61444cdc19bc6d" TO "UQ_b6b30080359ecd92bb2571c6336"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_b6b30080359ecd92bb2571c6336" TO "UQ_c8491296fbf8b61444cdc19bc6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "intra_id" TO "ft_id"`,
    );
  }
}
