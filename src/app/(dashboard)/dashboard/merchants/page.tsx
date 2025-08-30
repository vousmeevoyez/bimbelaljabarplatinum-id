import { getSessionFromCookie } from "@/utils/auth";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Users } from "lucide-react";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getMerchantsAction, deleteMerchantAction } from "@/actions/merchant-actions";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { getPresignedR2Url } from "@/lib/s3";

// Types
interface MerchantItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}


// ---- Page ----
export const metadata = {
  title: "My Merchants",
  description: "Manage your merchants",
};

export default async function MerchantsIndexPage() {
  // Check authentication
  const session = await getSessionFromCookie();
  if (!session) redirect("/sign-in?redirect=/dashboard/merchants");

  // Load merchants
  const [result, error] = await getMerchantsAction();
  let merchants: MerchantItem[] = [];
  if (result?.success && result.data){
    merchants = await Promise.all(result.data.map(async(data)=>{
      let logoUrl = '';
      if(data.logoUrl) {
        logoUrl = await getPresignedR2Url(data.logoUrl)
      };
      return {...data, logoUrl}
    }))
  }
  if (error) return notFound();

  return (
    <>
      <PageHeader items={[{ href: "/dashboard/merchants", label: "Merchants" }]} />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Merchants</h1>
            <p className="text-muted-foreground mt-2">Manage your merchants</p>
          </div>
          <Button asChild>
            <Link href={"/dashboard/merchants/create" as Route}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Merchant
            </Link>
          </Button>
        </div>

        {merchants.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-xl">You don&apos;t have any merchants yet</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Users className="h-16 w-16 text-muted-foreground/50" />
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button asChild>
                <Link href={"/dashboard/merchants/create" as Route}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create your first merchant
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchants.map((merchant) => (
              <Card key={merchant.id} className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="flex items-start gap-4">
                  {merchant.logoUrl ? (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
  <Image
    src={merchant.logoUrl}
    alt={`${merchant.name} logo`}
    fill
    className="object-cover"
    sizes="48px"
    unoptimized
  />
</div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                        {merchant.name}
                    </CardTitle>
                      <br/>
                    <CardDescription className="text-xs">
                      <Link
                            href={`/dashboard/products?merchantId=${merchant.id}` as Route}

                          className="hover:underline">
                          View merchant products
                      </Link>

                      </CardDescription>
                  </div>
                </CardHeader>
                <CardContent />
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/merchants/${merchant.id}/edit` as Route}>Edit</Link>
                  </Button>
                                          <DeleteConfirmation id={merchant.id} name={merchant.name} action={deleteMerchantAction} type="merchant" />
                </CardFooter>
              </Card>
            ))}

            <Link href={"/dashboard/merchants/create" as Route}>
              <Card className="h-full border-dashed border-2 hover:border-primary transition-all">
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">Create a new merchant</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <PlusIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

