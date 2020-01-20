#!/bin/bash
set -ex

STAGE=$1

if [ -z "$STAGE" ]; then
  echo "Variable (STAGE) setting target environment to deploy is invalid"
  echo "Deployment fails"
  exit 1
fi

export AWS_PROFILE=local

./node_modules/.bin/serverless deploy --conceal --stage $STAGE
