import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixChannelUserPermission1653635448266
  implements MigrationInterface
{
  name = 'fixChannelUserPermission1653635448266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "PK_498f7df08587dc19a171838b4c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP COLUMN "is_authorized"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "PK_6b013e0ae385a320d07b0ff2881" PRIMARY KEY ("channelId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ALTER COLUMN "channelId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ALTER COLUMN "channelId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_487b1ef1cef6e6a54a4b8dca3b7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "FK_a5a1b5f9ccb0f1bb110dc8b3500" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" DROP CONSTRAINT "PK_6b013e0ae385a320d07b0ff2881"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD "is_authorized" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_user_permission" ADD CONSTRAINT "PK_498f7df08587dc19a171838b4c0" PRIMARY KEY ("id")`,
    );
  }
}
