import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixChannel1651130581558 implements MigrationInterface {
  name = 'fixChannel1651130581558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roll" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_91319c8ec656321a667986a83c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_user" ("id" SERIAL NOT NULL, "is_ban" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channelId" integer, "userId" integer, "rollId" integer, CONSTRAINT "PK_7e5d4007402f6c41e35003494f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer, CONSTRAINT "CHK_c7e24be5f43eab94feb733aec9" CHECK ("text" <> ''), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channelId" integer, CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message_user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_050446ee874eefdd11ce87a370a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "toUserId" integer, CONSTRAINT "PK_dfe66cf2f224c9dc8be6ca5fde7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message_user_to_users_user" ("privateMessageUserId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_ae6f37fa2c45ead1fcd7f5f4139" PRIMARY KEY ("privateMessageUserId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afc07eecbfa15bc6a0ace61f91" ON "private_message_user_to_users_user" ("privateMessageUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4801f63ae20a2ab6528c1e550" ON "private_message_user_to_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" ADD CONSTRAINT "FK_3836ee173cdde32bd330bcfd81a" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" ADD CONSTRAINT "FK_a34f8beb8e568f64e24abce71b6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" ADD CONSTRAINT "FK_2aa80bce45b51edb164de4230d3" FOREIGN KEY ("rollId") REFERENCES "roll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message" ADD CONSTRAINT "FK_c07a7739f6a1ed674ca4081b18c" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message_user_to_users_user" ADD CONSTRAINT "FK_afc07eecbfa15bc6a0ace61f91e" FOREIGN KEY ("privateMessageUserId") REFERENCES "private_message_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message_user_to_users_user" ADD CONSTRAINT "FK_e4801f63ae20a2ab6528c1e5503" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "private_message_user_to_users_user" DROP CONSTRAINT "FK_e4801f63ae20a2ab6528c1e5503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message_user_to_users_user" DROP CONSTRAINT "FK_afc07eecbfa15bc6a0ace61f91e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message" DROP CONSTRAINT "FK_c07a7739f6a1ed674ca4081b18c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" DROP CONSTRAINT "FK_2aa80bce45b51edb164de4230d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" DROP CONSTRAINT "FK_a34f8beb8e568f64e24abce71b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user" DROP CONSTRAINT "FK_3836ee173cdde32bd330bcfd81a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4801f63ae20a2ab6528c1e550"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_afc07eecbfa15bc6a0ace61f91"`,
    );
    await queryRunner.query(`DROP TABLE "private_message_user_to_users_user"`);
    await queryRunner.query(`DROP TABLE "private_message"`);
    await queryRunner.query(`DROP TABLE "private_message_user"`);
    await queryRunner.query(`DROP TABLE "channel_message"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TABLE "channel_user"`);
    await queryRunner.query(`DROP TABLE "roll"`);
  }
}
