import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixMatchEntity1650769073743 implements MigrationInterface {
  name = 'fixMatchEntity1650769073743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "hostPlayerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "guestPlayerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7" FOREIGN KEY ("hostPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801" FOREIGN KEY ("guestPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "guestPlayerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "hostPlayerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_439f83f2637a7ea2d8bf97d9801" FOREIGN KEY ("guestPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_5fa2f211c458e43e6b0dd7253f7" FOREIGN KEY ("hostPlayerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
