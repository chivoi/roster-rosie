import { S3 } from 'aws-sdk';

const s3 = new S3();

interface Duty {
  current: number;
  next: number;
}

const FILE = {
  Bucket: 'cyclic-real-pink-cockroach-gear-ap-southeast-2',
  Key: 'duty.json',
};

export const readDutyFile = async () => {
  try {
    const s3File = await s3.getObject(FILE).promise();
    console.log(s3File);
    console.log(s3File.Body);
    console.log(s3File.Body?.toString());
    if (s3File.Body) {
      return JSON.parse(s3File.Body?.toString());
    } else {
      return { current: 0, next: 0 };
    }
  } catch (err) {
    return { current: 0, next: 0 };
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
