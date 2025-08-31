// app/api/merchants/og-data/route.ts
import { getMerchantsAction } from "@/actions/merchant-actions";
import { getPresignedR2Url } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET() {
  const [result] = await getMerchantsAction();
  const data = result?.success && result.data ? result.data : [];
  const count = data.length;

  const logos = await Promise.all(
    data.filter(m => m.logoUrl).slice(0, 8).map(async m => {
      try { return await getPresignedR2Url(m.logoUrl!); } catch { return null; }
    })
  );

  return Response.json({ count, logos: logos.filter(Boolean) });
}

