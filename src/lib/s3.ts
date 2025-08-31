import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

function r2Key(f: File, prefix = "uploads") {
  const dot = f.name.lastIndexOf(".");
  const ext = dot >= 0 ? f.name.slice(dot + 1) : "bin";
  return `${prefix}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
}

export async function uploadToR2(file: File, prefix?: string) {
  const key = r2Key(file, prefix);
  const { env } = getCloudflareContext();
  const bucket = env.NEXT_R2_BUCKET as R2Bucket;

  await bucket.put(key, file, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return key;
}

/** For now, just return a plain URL */
export async function getPresignedR2Url(key: string) {
  return `${process.env.NEXT_PUBLIC_R2_BASE}/${key}`;
}

