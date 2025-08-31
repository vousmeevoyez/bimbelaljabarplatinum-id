// app/merchants/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgData = { count: number; logos: string[] };

export default async function OGImage() {
  let count = 0, logos: string[] = [];
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const url = new URL("/api/merchants/og-data", base).toString();
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as Partial<OgData>;
      count = typeof data.count === "number" ? data.count : 0;
      logos = Array.isArray(data.logos) ? data.logos.filter((x): x is string => typeof x === "string") : [];
    }
  } catch {}

  const items = logos.length > 0 ? logos : Array(8).fill(null);

  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg,#0f172a,#1f2937)", color: "#fff", padding: 48, boxSizing: "border-box", position: "relative", fontFamily: "ui-sans-serif,system-ui" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>Merchants</div>
        <div style={{ fontSize: 28, opacity: .9 }}>{count ? `${count} merchant${count===1?"":"s"} available` : "No merchants yet"}</div>
        <div style={{ fontSize: 20, opacity: .7 }}>Explore brands and their products.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,120px)", gridAutoRows: "120px", gap: 14, width: 620, alignContent: "center", justifyContent: "center" }}>
        {items.map((src, idx) => (
          <div key={idx} style={{ width:120, height:120, borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)", background:"rgba(0,0,0,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {src ? <img src={src} alt="" width={120} height={120} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : null}
          </div>
        ))}
      </div>

      <div style={{ position:"absolute", inset:0, background:"radial-gradient(800px 300px at 100% 0%, rgba(59,130,246,.25), transparent 60%)" }}/>
    </div>),
    size
  );
}

