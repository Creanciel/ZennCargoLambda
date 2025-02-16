import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { getConfig } from './config';

const config = getConfig();

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = s3.Bucket.fromBucketName(
      this,
      `${config.lambdaName}-s3-bucket`,
      config.lambdaImageBucket,
    );

    const code = lambda.Code.fromBucket(
      s3Bucket,
      config.lambdaImageKey,
    );

    // Log Group の明示的な作成
    const logGroup = new logs.LogGroup(
      this,
      `${config.lambdaName}-lambda-log-group`,
      {
        logGroupName: `/aws/lambda/${config.lambdaName}`,
        retention: logs.RetentionDays.TWO_WEEKS, // 2週間で削除
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Stack を削除すると同時に削除
      },
    );

    // Role
    const role = new iam.Role(
      this,
      `${config.lambdaName}-lambda-role`,
      {
        roleName: `${config.lambdaName}-lambda-role`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: `${config.lambdaName} lambda's role`,
      },
    );

    // Lambda の Log に関する policy を inline policy で追加
    role.attachInlinePolicy(
      new iam.Policy(
        this,
        `${config.lambdaName}-lambda-default-policy`,
        {
          policyName: `${config.lambdaName}-lambda-default-policy`,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
              resources: [logGroup.logGroupArn],
            }),
          ],
        },
      ),
    );

    // Lambda の作成
    const lmd = new lambda.Function(
      this,
      `${config.lambdaName}-lambda`,
      {
        functionName: `${config.lambdaName}`,
        runtime: lambda.Runtime.PROVIDED_AL2,
        handler: 'bootstrap',
        architecture: lambda.Architecture.ARM_64,
        code,
        logGroup,
        role,
        memorySize: 128,
        timeout: cdk.Duration.seconds(30),
      },
    );

    // API Gateway に Lambda を紐づける設定
    const integration = new apigateway.LambdaIntegration(lmd, {
      allowTestInvoke: false, // テストステージを作成しない
    });

    // API Gateway の作成
    const api = new apigateway.RestApi(
      this,
      `${config.lambdaName}-api-gateway`,
      {
        restApiName: `${config.lambdaName}-api-gateway`,
        deploy: true,
        deployOptions: {
          stageName: 'main',
        },
      },
    );

    // API Gateway の resource の root (/) に Lambda (Integration) を紐づける
    api.root.addMethod('GET', integration);
  }
}
