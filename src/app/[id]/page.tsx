import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPresignedR2Url } from "@/lib/s3";
import { getProductsAction } from "@/actions/product-actions";
import Link from "next/link";
import { getSessionFromCookie } from "@/utils/auth";

export const metadata = { title: "My Merchants", description: "Manage your merchants" };

interface PageProps { params: Promise<{ id: string }> }

export default async function MerchantProductsPage({ params }: PageProps) {
  const { id } = await params;

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

  // Hide paid products from unauthenticated users
  const visibleProducts = isAuthed ? products : products.filter(p => (p.priceCents ?? 0) === 0);

  const redirect = `/${id}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Separator />

      {!isAuthed && products.some(p => (p.priceCents ?? 0) > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to see paid products</CardTitle>
            <CardDescription>Some items are hidden. Sign in to view and purchase them.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href={`/sign-in?redirect=${encodeURIComponent(redirect)}`}>Sign in / Sign up</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No products yet</CardTitle>
              <CardDescription>
                {isAuthed ? "Create your first product to get started." : "Nothing to show. Sign in to see paid products if available."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          visibleProducts.map((product) => {
            const requiresAuth = (product.priceCents ?? 0) > 0;
            const buyHref = !isAuthed && requiresAuth
              ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
              : product.url;

            const buyRel = !isAuthed && requiresAuth ? undefined : "noopener noreferrer";
            const buyTarget = !isAuthed && requiresAuth ? undefined : "_blank";

            return (
              <Card key={product.id} className="h-full overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={`${product.name} logo`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <CardHeader className="pb-2 flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl leading-tight line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-base px-3 py-1 shrink-0">
                    {product.priceCents === 0
                      ? "Free"
                      : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.priceCents)}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-0 flex-1" />

                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link href={buyHref} target={buyTarget} rel={buyRel}>
                      {(!isAuthed && requiresAuth) ? "Sign in to buy" : "Buy"}
                    </Link>
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
