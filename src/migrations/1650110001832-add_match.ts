import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMatch1650110001832 implements MigrationInterface {
  name = 'addMatch1650110001832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."match_result_enum" AS ENUM('host', 'guest', 'draw')`,
    );
    await queryRunner.query(
      `CREATE TABLE "match" ("id" SERIAL NOT NULL, "host_player_points" integer NOT NULL DEFAULT '0', "guest_player_points" integer NOT NULL DEFAULT '0', "result" "public"."match_result_enum" NOT NULL DEFAULT 'draw', "start_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_at" TIMESTAMP WITH TIME ZONE, "hostPlayerId" integer, "guestPlayerId" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TYPE "public"."match_result_enum"`);
  }
}
