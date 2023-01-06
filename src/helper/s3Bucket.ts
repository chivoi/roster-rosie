import { S3 } from 'aws-sdk';
import path from 'path';

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const s3 = new S3();

interface Duty {
  current: number;
  next: number;
}

export const readDutyFile = async (filename: string) => {
  try {
    console.log("Bucki ", process.env.S3_BUCKET_NAME)
    const s3File = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: `${filename}.json`,
    }).promise();
    if (s3File.Body) {
      return JSON.parse(s3File.Body?.toString());
    } else {
      return { current: 0, next: 1 };
    }
  } catch (err) {
    console.error(err);
    return { current: 0, next: 1 };
  }
};

export const writeDutyFile = async (body: Duty, filename: string) => {
  await s3
    .putObject({
      Body: JSON.stringify(body),
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: `${filename}.json`,
    })
    .promise();
};
