import NavFooterLayout from "@/layouts/NavFooterLayout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchants",
  description: "Browse all merchants and their products.",
  openGraph: {
    title: "Merchants",
    description: "Browse all merchants and their products.",
    type: "website",
    url: "/merchants",
    images: [{ url: "/merchants/opengraph-image", width: 1200, height: 630, alt: "Merchants overview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merchants",
    description: "Browse all merchants and their products.",
    images: ["/merchants/opengraph-image"],
  },
  alternates: { canonical: "/merchants" },
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <NavFooterLayout>{children}</NavFooterLayout>;
}

