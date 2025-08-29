#!/bin/bash
set -euo pipefail

: "${BUCKET_NAME:=my-bucket-name}"

echo "[init] Ensuring S3 bucket: ${BUCKET_NAME}"
# 'awslocal' is preinstalled in the LocalStack container.
if ! awslocal s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
  awslocal s3 mb "s3://${BUCKET_NAME}"
  echo "[init] Created bucket ${BUCKET_NAME}"
else
  echo "[init] Bucket ${BUCKET_NAME} already exists"
fi
