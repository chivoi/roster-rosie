import { S3 } from 'aws-sdk';
import path from 'path';
import { Duty, TuesdayCount } from '../interfaces'

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const s3 = new S3();

export const readDutyFile = async (filename: string) => {
  try {
    console.log("Reading this file ", filename)
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

export const writeFile = async (body: Duty | TuesdayCount, filename: string) => {
  await s3
    .putObject({
      Body: JSON.stringify(body),
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: `${filename}.json`,
    })
    .promise();
};

export const readTuesdayCountFile = async () => {
  try {
    console.log("Reading tuesday count file")
    const s3File = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: `tuesday-count.json`,
    }).promise();
    if (s3File.Body) {
      return JSON.parse(s3File.Body?.toString());
    } else {
      return { count: 0 };
    }
  } catch (err) {
    console.error(err);
    return { count: 0 };
  }
};