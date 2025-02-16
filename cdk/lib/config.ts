const lambdaName = 'cargo-lambda';

export interface Config {
  awsAccount: string;
  region: string;

  lambdaName: string;

  lambdaImageBucket: string;
  lambdaImageKey: string;
}

export const getConfig = (): Config => {
  const env = process.env;

  const awsAccount = env.AWS_ACCOUNT;
  if (!awsAccount) {
    throw new Error('Environment AWS_ACCOUNT is Required.');
  }

  const region = env.REGION || 'us-east-1';

  const lambdaImageBucket = env.LAMBDA_IMAGE_BUCKET;
  if (!lambdaImageBucket) {
    throw new Error('Environment LAMBDA_IMAGE_BUCKET is Required.');
  }

  const lambdaImageKey = env.LAMBDA_IMAGE_KEY;
  if (!lambdaImageKey) {
    throw new Error('Environment LAMBDA_IMAGE_KEY is Required.');
  }

  return {
    awsAccount,
    region,
    lambdaName,
    lambdaImageBucket,
    lambdaImageKey,
  };
};
