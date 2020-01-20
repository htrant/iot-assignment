#!/bin/bash
set -ex

$TARGET_ENVIRONMENT=$1

if [ -z "$TARGET_ENVIRONMENT" ]; then
  echo "Variable (TARGET_ENVIRONMENT) setting target environment to deploy is invalid"
  echo "Deployment fails"
  exit 1
fi

export AWS_PROFILE=local

./node_modules/.bin/serverless deploy --conceal --stage $TARGET_ENVIRONMENT
