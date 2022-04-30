import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameMatchUserRelation1651297724211
  implements MigrationInterface
{
  name = 'renameMatchUserRelation1651297724211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801"`,
    );
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "hostPlayerId"`);
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "guestPlayerId"`);
    await queryRunner.query(
      `ALTER TABLE "match" ADD "host_player_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD "guest_player_id" integer NOT NULL`,
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
      `ALTER TABLE "match" DROP COLUMN "guest_player_id"`,
    );
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "host_player_id"`);
    await queryRunner.query(
      `ALTER TABLE "match" ADD "guestPlayerId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD "hostPlayerId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801" FOREIGN KEY ("guestPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7" FOREIGN KEY ("hostPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
