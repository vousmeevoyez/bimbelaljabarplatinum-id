import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPresignedR2Url } from "@/lib/s3";
import { getProductsAction } from "@/actions/product-actions";
import { getSessionFromCookie } from "@/utils/auth";

export const metadata = { title: "Merchant Saya", description: "Kelola merchant Anda" };

interface MerchantProductsPageProps {
  params: Promise<{ id: string }>
}

export default async function MerchantProductsPage({ params }: MerchantProductsPageProps) {
  const { id } = await params

  const session = await getSessionFromCookie();
  const isAuthed = !!session?.user;

  const [result, error] = await getProductsAction({ merchantId: id });
  let products: Product[] = [];

  if (result?.success && result.data) {
    products = await Promise.all(
      result.data.map(async (data) => {
        const imageUrl = data.imageUrl ? (await getPresignedR2Url(data.imageUrl)) || "" : "";
        return { ...data, imageUrl };
      })
    );
  }

  if (error) return notFound();

  const redirect = `/${id}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Separator />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Belum ada produk</CardTitle>
              <CardDescription>
                {isAuthed ? "Buat produk pertama Anda untuk memulai." : "Belum ada yang bisa ditampilkan. Masuk untuk melihat produk berbayar jika tersedia."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          products.map((product) => {
            const requiresAuth = (product.priceCents ?? 0) > 0;
            const buyHref = !isAuthed && requiresAuth
              ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
              : (product.url || "/");
            const buyRel = !isAuthed && requiresAuth ? undefined : "noopener noreferrer";
            const buyTarget = !isAuthed && requiresAuth ? undefined : "_blank";

            return (
              <Card key={product.id} className="h-full overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={`Logo ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl leading-tight line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-base px-3 py-1 shrink-0">
                    {product.priceCents === 0
                      ? "Gratis"
                      : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.priceCents)}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0 flex-1" />
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <a href={buyHref} target={buyTarget} rel={buyRel}>
                      {(!isAuthed && requiresAuth) ? "Masuk/daftar untuk membeli" : "Beli"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </section>
    </main>
  );
}
