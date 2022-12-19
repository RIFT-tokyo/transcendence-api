import { MigrationInterface, QueryRunner } from 'typeorm';

export class addConditionNumberToAchievement1670935408305
  implements MigrationInterface
{
  name = 'addConditionNumberToAchievement1670935408305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "achievement" ADD "condition_number" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "achievement" DROP COLUMN "condition_number"`,
    );
  }
}
