// app/merchants/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getMerchantsAction } from "@/actions/merchant-actions";
import { getPresignedR2Url } from "@/lib/s3";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const [result] = await getMerchantsAction();
  const merchants = result?.success && result.data ? result.data : [];
  const count = merchants.length;

  // Grab up to 8 logos with presigned URLs
  const logos = (
    await Promise.all(
      merchants
        .filter(m => m.logoUrl)
        .slice(0, 8)
        .map(async m => {
          try {
            const url = await getPresignedR2Url(m.logoUrl!);
            return url ?? null;
          } catch { return null; }
        })
    )
  ).filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg,#0f172a 0%,#111827 35%,#1f2937 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
          position: "relative",
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        {/* Title + count */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ fontSize: 64, lineHeight: 1.1, fontWeight: 800, letterSpacing: -1 }}>
            Merchants
          </div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>
            {count === 0 ? "No merchants yet" : `${count} merchant${count === 1 ? "" : "s"} available`}
          </div>
          <div style={{ marginTop: 8, fontSize: 20, opacity: 0.7 }}>
            Explore brands and their products.
          </div>
        </div>

        {/* Logo mosaic */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 120px)",
            gridAutoRows: "120px",
            gap: 14,
            alignContent: "center",
            justifyContent: "center",
            width: 620,
          }}
        >
          {logos.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 16,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            ))
          ) : (
            logos.map((src, i) => (
              <div
                key={i}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* next/og supports regular <img> in the ImageResponse tree */}
                { }
                <img
                  src={src}
                  alt=""
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            ))
          )}
        </div>

        {/* Subtle corner accent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(800px 300px at 100% 0%, rgba(59,130,246,0.25), transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

