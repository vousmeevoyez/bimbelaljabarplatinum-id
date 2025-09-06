import { MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/constants";
import { z } from "zod";

type ImageMime = typeof ACCEPTED_IMAGE_TYPES[number] | "image/gif" | "image/avif";

const typeLabels: Record<ImageMime, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/avif": "AVIF"
};

type AcceptedImageType = typeof ACCEPTED_IMAGE_TYPES[number];



function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let num = bytes;
  while (num >= 1024 && i < units.length - 1) {
    num /= 1024;
    i++;
  }
  return `${num} ${units[i]}`;
}

export const MAX_IMAGE_SIZE_LABEL = formatBytes(MAX_IMAGE_SIZE);

export function imageUploadSpecDescription(): string {
  const types = ACCEPTED_IMAGE_TYPES.map(t => typeLabels[t]).join(", ");
  return `${types} (max ${MAX_IMAGE_SIZE_LABEL})`;
}

const isAcceptedImageType = (t: string): t is AcceptedImageType =>
  (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(t);

export const imageUploadSchema = z.object({
  image: z
    .instanceof(FileList)
    .transform(l => (l?.length ? l[0] : null) as File | null) // -> File | null
    .refine(f => !f || isAcceptedImageType(f.type), {
      message: "Unsupported image type",
    })
    .refine(f => !f || f.size <= MAX_IMAGE_SIZE, {
      message: `Image must be ≤ ${MAX_IMAGE_SIZE_LABEL}`,
    })
});
