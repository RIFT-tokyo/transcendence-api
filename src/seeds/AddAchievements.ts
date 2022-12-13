import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';

export class AddAchievements implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    const fileDir = 'src/images/';
    const prizeKey = 'achievements/prize.png';
    const trophyKey = 'achievements/trophy.png';
    const prizeBuffer = readFileSync(fileDir + prizeKey);
    const trophyBuffer = readFileSync(fileDir + trophyKey);
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_DOCKER_ENDPOINT_URL,
      s3ForcePathStyle: true,
    });

    s3.upload(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: prizeBuffer,
        Key: prizeKey,
      },
      function (err) {
        if (err) {
          console.log(err);
        }
      },
    );
    s3.upload(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: trophyBuffer,
        Key: trophyKey,
      },
      function (err) {
        if (err) {
          console.log(err);
        }
      },
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into('achievement')
      .values([
        {
          name: 'Winner',
          description: 'Win a game',
          condition_number: 1,
          image:
            process.env.AWS_S3_HOST_ENDPOINT_URL +
            '/' +
            process.env.AWS_S3_BUCKET_NAME +
            '/' +
            prizeKey,
        },
        {
          name: 'Victor',
          description: 'Win 10 games',
          condition_number: 10,
          image:
            process.env.AWS_S3_HOST_ENDPOINT_URL +
            '/' +
            process.env.AWS_S3_BUCKET_NAME +
            '/' +
            trophyKey,
        },
      ])
      .execute();
  }
}
