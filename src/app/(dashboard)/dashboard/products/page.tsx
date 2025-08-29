import { getSessionFromCookie } from "@/utils/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Users } from "lucide-react";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getMerchantsAction } from "@/actions/merchant-actions";

export const metadata = {
  title: "My Products",
  description: "Manage your merchants",
};

interface ProductRole {
  name: string;
  id: string;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export default async function ProductsIndexPage() {
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/dashboard/merchants");
  }

  // Get merchants data (products page uses merchants for now)
  const [result, error] = await getMerchantsAction();

  let merchants: ProductItem[] = [];
  if (result?.success && result.data) {
    merchants = result.data;
  }

  if (error) {
    return notFound();
  }

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/dashboard/merchants",
            label: "Products"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Products</h1>
            <p className="text-muted-foreground mt-2">Manage your merchants</p>
          </div>
          <Button asChild>
            <Link href={"/dashboard/merchants/create" as Route}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Product
            </Link>
          </Button>
        </div>

        {/* Pending invitations not applicable on products page */}

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
              <Link key={merchant.id} href={`/dashboard/merchants/${merchant.slug}` as Route}>
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardHeader className="flex flex-row items-start gap-4">
                    {merchant.logoUrl ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={merchant.logoUrl}
                          alt={`${merchant.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <Users className="h-6 w-6" />
                      </div>
                    )}
                  </CardHeader>
                    <CardContent>
                      {merchant.name}
                    </CardContent>
                </Card>
              </Link>
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
