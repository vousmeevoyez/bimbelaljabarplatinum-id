import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const r2 = new S3Client({
  region: process.env.NODE_ENV === "development" ? "us-east-1" : "auto",
  endpoint: process.env.NODE_ENV === "development"
    ? "http://localhost:4566"
    : `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

function generateR2Key(file: File, prefix = "uploads") {
  const ext = file.name.split(".").pop();
  return `${prefix}/${Date.now()}-${randomUUID()}.${ext}`;
}

export async function uploadToR2(file: File, prefix?: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = generateR2Key(file, prefix);

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return key; // only return the key
}

export async function getPresignedR2Url(
  key: string,
  opts?: { expiresIn?: number; downloadName?: string; responseContentType?: string }
): Promise<string> {
  const { expiresIn = 900, downloadName, responseContentType } = opts ?? {};

  const cmd = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ResponseContentDisposition: downloadName ? `attachment; filename="${downloadName}"` : undefined,
    ResponseContentType: responseContentType,
  });

  return getSignedUrl(r2, cmd, { expiresIn });
}
