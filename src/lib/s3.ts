import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "edge";

function s3() {
  const isDev = process.env.NODE_ENV === "development";
  return new S3Client({
    region: "auto",
    endpoint: isDev ? "http://localhost:4566"
                    : `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

function r2Key(f: File, prefix = "uploads") {
  const ext = f.name.includes(".") ? f.name.split(".").pop() : "bin";
  return `${prefix}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
}

export async function uploadToR2(file: File, prefix?: string) {
  const key = r2Key(file, prefix);
  const ab = await file.arrayBuffer();          // 👈 normalize to ArrayBuffer
  await s3().send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: new Uint8Array(ab),                   // 👈 or just `ab`
    ContentType: file.type || "application/octet-stream",
    ContentLength: file.size,                   // 👈 important for signing
  }));
  return key;
}

export async function getPresignedR2Url(
  key: string,
  opts?: { expiresIn?: number; downloadName?: string; responseContentType?: string }
) {
  const { expiresIn = 900, downloadName, responseContentType } = opts ?? {};
  const cmd = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ResponseContentDisposition: downloadName ? `attachment; filename="${downloadName}"` : undefined,
    ResponseContentType: responseContentType,
  });
  return getSignedUrl(s3(), cmd, { expiresIn });
}

