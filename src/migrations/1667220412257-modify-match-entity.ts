import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyMatchEntity1667220412257 implements MigrationInterface {
  name = 'modifyMatchEntity1667220412257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_62800d9d384a3c286c0a020645c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_c6eb55846de3ffc7ddc66259898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "start_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "end_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "host_player_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "guest_player_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_62800d9d384a3c286c0a020645c" FOREIGN KEY ("host_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_c6eb55846de3ffc7ddc66259898" FOREIGN KEY ("guest_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_c6eb55846de3ffc7ddc66259898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_62800d9d384a3c286c0a020645c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "guest_player_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "host_player_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "end_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "start_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_c6eb55846de3ffc7ddc66259898" FOREIGN KEY ("guest_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_62800d9d384a3c286c0a020645c" FOREIGN KEY ("host_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
