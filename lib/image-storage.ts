import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

type ImageBucket = "product-images" | "order-preparations";

const localDirectories: Record<ImageBucket, string> = {
  "product-images": "products",
  "order-preparations": "orders",
};

function getServerStorageClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) return null;

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function savePublicImage({
  bucket,
  prefix,
  contents,
}: {
  bucket: ImageBucket;
  prefix: string;
  contents: Buffer;
}) {
  const filename = `${prefix}-${randomUUID()}.webp`;
  const storage = getServerStorageClient();

  if (storage) {
    const { error } = await storage.storage.from(bucket).upload(filename, contents, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) throw new Error(`STORAGE_UPLOAD_FAILED: ${error.message}`);

    return storage.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
  }

  const directoryName = localDirectories[bucket];
  const directory = path.join(process.cwd(), "public", "uploads", directoryName);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), contents);
  return `/uploads/${directoryName}/${filename}`;
}
