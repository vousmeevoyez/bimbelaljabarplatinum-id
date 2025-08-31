import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MerchantWithCount } from "@/db/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMerchantsAction } from "@/actions/merchant-actions";
import { getPresignedR2Url } from "@/lib/s3";

export const metadata = { title: "My Merchants", description: "Manage your merchants" };

const pluralize = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default async function MerchantsIndexPage() {
  const [result, error] = await getMerchantsAction();
  let merchants: MerchantWithCount[] = [];

  if (result?.success && result.data) {
    merchants = await Promise.all(
      result.data.map(async (data) => {
        let logoUrl = null;
        if (data.logoUrl) logoUrl = await getPresignedR2Url(data.logoUrl);
        return { ...data, logoUrl };
      })
    );
  }
  if (error) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Separator />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {merchants.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No merchants yet</CardTitle>
              <CardDescription>Create your first merchant to get started.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          merchants.map((merchant) => (
            <Card key={merchant.id} className="h-full overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative w-full aspect-[4/3]">
                {merchant.logoUrl && <Image
                  src={merchant.logoUrl}
                  alt={`${merchant.name} logo`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
    unoptimized
                />}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="backdrop-blur">
                    {pluralize(merchant.productCount ?? 0, "product")}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl leading-tight line-clamp-1">{merchant.name}</CardTitle>
                {merchant.description ? (
                  <CardDescription className="line-clamp-2">{merchant.description}</CardDescription>
                ) : null}
              </CardHeader>

              <CardContent className="pt-0 flex-1" />

              {merchant.productCount !== 0 &&<CardFooter className="pt-0">
                <Button asChild className="w-full">
                    <Link href={`/${merchant.id}`}>View products</Link>
                </Button>
              </CardFooter>}
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
