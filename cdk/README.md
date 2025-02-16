# CDK

## CDK Diff

既にデプロイされているものと差分を確認する。デプロイされていなくても使える。

```sh
AWS_ACCOUNT='' \
LAMBDA_IMAGE_BUCKET='' \
LAMBDA_IMAGE_KEY='' \
  npm run cdk diff cargo-lambda-stack
```

## CDK Deploy

デプロイする。

```sh
AWS_ACCOUNT='' \
LAMBDA_IMAGE_BUCKET='' \
LAMBDA_IMAGE_KEY='' \
  npm run cdk deploy cargo-lambda-stack
```

## CDK Destroy

削除する。CloudFormation から削除でもよい。

```sh
AWS_ACCOUNT='' \
LAMBDA_IMAGE_BUCKET='' \
LAMBDA_IMAGE_KEY='' \
  npm run cdk deploy cargo-lambda-stack
```
