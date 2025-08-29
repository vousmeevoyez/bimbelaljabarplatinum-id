import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { CreateMerchantForm } from "@/components/merchants/create-merchant-form";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Create Merchant",
  description: "Create a new merchant for your organization",
};

export default async function CreateMerchantPage() {
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/dashboard/merchants/create");
  }

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
            label: "Create Merchant"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Create a new merchant</h1>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <CreateMerchantForm />
          </div>
        </div>
      </div>
    </>
  );
}
