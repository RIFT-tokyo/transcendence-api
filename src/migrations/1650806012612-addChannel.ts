import {MigrationInterface, QueryRunner} from "typeorm";

export class addChannel1650806012612 implements MigrationInterface {
    name = 'addChannel1650806012612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roll" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_91319c8ec656321a667986a83c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_user" ("id" SERIAL NOT NULL, "is_ban" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "channelId" integer, "userId" integer, "rollId" integer, CONSTRAINT "PK_7e5d4007402f6c41e35003494f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "password" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "channelId" integer, "userId" integer, CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dm" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3d25307480b6db04b2ea3b7f204" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dm_message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dmId" integer, "fromUserId" integer, "toUserId" integer, CONSTRAINT "PK_a48eb39c900efefb12269aa0625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel_user" ADD CONSTRAINT "FK_3836ee173cdde32bd330bcfd81a" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_user" ADD CONSTRAINT "FK_a34f8beb8e568f64e24abce71b6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_user" ADD CONSTRAINT "FK_2aa80bce45b51edb164de4230d3" FOREIGN KEY ("rollId") REFERENCES "roll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_65c489515cdf007c57fe42e469c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dm_message" ADD CONSTRAINT "FK_07ac441998d6eeee9df79d02a00" FOREIGN KEY ("dmId") REFERENCES "dm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dm_message" ADD CONSTRAINT "FK_f2d6b6f0ada1c0f8b413fd08f73" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dm_message" ADD CONSTRAINT "FK_eff8a22f78cd1b53c3ab99b94d7" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dm_message" DROP CONSTRAINT "FK_eff8a22f78cd1b53c3ab99b94d7"`);
        await queryRunner.query(`ALTER TABLE "dm_message" DROP CONSTRAINT "FK_f2d6b6f0ada1c0f8b413fd08f73"`);
        await queryRunner.query(`ALTER TABLE "dm_message" DROP CONSTRAINT "FK_07ac441998d6eeee9df79d02a00"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_65c489515cdf007c57fe42e469c"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "channel_user" DROP CONSTRAINT "FK_2aa80bce45b51edb164de4230d3"`);
        await queryRunner.query(`ALTER TABLE "channel_user" DROP CONSTRAINT "FK_a34f8beb8e568f64e24abce71b6"`);
        await queryRunner.query(`ALTER TABLE "channel_user" DROP CONSTRAINT "FK_3836ee173cdde32bd330bcfd81a"`);
        await queryRunner.query(`DROP TABLE "dm_message"`);
        await queryRunner.query(`DROP TABLE "dm"`);
        await queryRunner.query(`DROP TABLE "channel_message"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "channel_user"`);
        await queryRunner.query(`DROP TABLE "roll"`);
    }

}
