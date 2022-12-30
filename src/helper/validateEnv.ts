export const validateEnv = () => {
  const SLACK_WEBHOOK_URL = process.env.WEBHOOK_URL;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  if (!SLACK_WEBHOOK_URL || !S3_BUCKET_NAME) {
    console.warn('Missing required env');
    return false;
  }
  return true;
};
