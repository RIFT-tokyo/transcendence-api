import {MigrationInterface, QueryRunner} from "typeorm";

export class joinColumnForChannelMessageOneToOne1658835949496 implements MigrationInterface {
    name = 'joinColumnForChannelMessageOneToOne1658835949496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_message" ADD "messageId" integer`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "UQ_ff66f23e0d7c30c7e81332aa7cc" UNIQUE ("messageId")`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_ff66f23e0d7c30c7e81332aa7cc" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_ff66f23e0d7c30c7e81332aa7cc"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "UQ_ff66f23e0d7c30c7e81332aa7cc"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP COLUMN "messageId"`);
    }

}
