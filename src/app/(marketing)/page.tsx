import { getSessionFromCookie } from "@/utils/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Route } from "next";
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
      <div className="container mx-auto px-5 pb-12">
        <br/>
        {merchants.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-xl">You don&apos;t have any merchants yet</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Users className="h-16 w-16 text-muted-foreground/50" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchants.map((merchant) => (
              <Card key={merchant.id} className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="flex items-start gap-4">
                  {merchant.logoUrl ? (
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img src={merchant.logoUrl} alt={`${merchant.name} logo`} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                      <Link href={`/dashboard/merchants/${merchant.id}` as Route} className="hover:underline">
                        {merchant.name}
                      </Link>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

