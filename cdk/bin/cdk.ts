#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { getConfig } from '../lib/config';

const app = new cdk.App();

const config = getConfig();

new CdkStack(
  app,
  `${config.lambdaName}-stack`,
  {
    stackName: `${config.lambdaName}-stack`,
    env: {
      account: config.awsAccount,
      region: config.region,
    },
  }
);
