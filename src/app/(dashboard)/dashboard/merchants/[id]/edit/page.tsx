import { redirect, notFound } from "next/navigation";
import { getSessionFromCookie } from "@/utils/auth";
import { EditMerchantForm, type Merchant } from "@/components/merchants/edit-merchant-form";
import { getMerchantAction } from "@/actions/merchant-actions";
import { PageHeader } from "@/components/page-header";
import { getPresignedR2Url } from "@/lib/s3";

export const metadata = {
  title: "Edit Merchant",
  description: "Edit a new merchant for your organization",
};


interface EditMerchantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMerchantPage({params}: EditMerchantPageProps) {
  const { id } = await params;
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/dashboard/merchants/create");
  }

  const [result, error] = await getMerchantAction({merchantId: id});

  if (error) return notFound();

  const merchant: Merchant = {
    ...result.data,
    description: result.data.description || undefined,
    logoUrl: result.data.logoUrl
      ? await getPresignedR2Url(result.data.logoUrl)
      : undefined
  };

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/dashboard/merchants",
            label: "Merchants"
          },
          {
            href: "/dashboard/merchants/create",
            label: "Edit Merchant"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Edit a merchant</h1>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <EditMerchantForm merchant={merchant} />
          </div>
        </div>
      </div>
    </>
  );
}
