import { MigrationInterface, QueryRunner } from 'typeorm';

export class addChannel1651150647237 implements MigrationInterface {
  name = 'addChannel1651150647237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_user_permission" ("id" SERIAL NOT NULL, "is_ban" boolean NOT NULL DEFAULT false, "is_authorized" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channelId" integer, "userId" integer, "roleId" integer, CONSTRAINT "PK_498f7df08587dc19a171838b4c0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channelId" integer, "userId" integer, CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message_user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_050446ee874eefdd11ce87a370a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "fromUserId" integer, "toUserId" integer, CONSTRAINT "PK_dfe66cf2f224c9dc8be6ca5fde7" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_a53325430eaca5aa440b9336e08" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" ADD CONSTRAINT "FK_65c489515cdf007c57fe42e469c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "private_message" ADD CONSTRAINT "FK_0318016f8cb241f2062a2b0a71a" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "private_message" DROP CONSTRAINT "FK_0318016f8cb241f2062a2b0a71a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" DROP CONSTRAINT "FK_65c489515cdf007c57fe42e469c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_a53325430eaca5aa440b9336e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500"`,
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
    await queryRunner.query(`DROP TABLE "channel_user_permission"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
