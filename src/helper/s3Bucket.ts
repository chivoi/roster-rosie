import { S3 } from 'aws-sdk';

const s3 = new S3();

interface Duty {
  current: number;
  next: number;
  retroCurrent: number;
  retroNext: number;
}

const FILE = {
  Bucket: process.env.S3_BUCKET_NAME || '',
  Key: 'duty.json',
};

export const readDutyFile = async () => {
  try {
    const s3File = await s3.getObject(FILE).promise();
    if (s3File.Body) {
      return JSON.parse(s3File.Body?.toString());
    } else {
      return { current: 0, next: 1, retroCurrent: 0, retroNext: 1 };
    }
  } catch (err) {
    console.error(err);
    return { current: 0, next: 1, retroCurrent: 0, retroNext: 1 };
  }
};

export const writeDutyFile = async (body: Duty) => {
  await s3
    .putObject({
      Body: JSON.stringify(body),
      ...FILE,
    })
    .promise();
};
