import { redirect, notFound } from "next/navigation";
import { getSessionFromCookie } from "@/utils/auth";
import { CreateProductForm } from "@/components/products/create-product-form";
import { PageHeader } from "@/components/page-header";
import { getMerchantsAction } from "@/actions/merchant-actions";

export const metadata = {
  title: "Create Product",
  description: "Create a new product for your organization",
};

export default async function CreateProductPage() {
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/admin/products/create");
  }

  const [result, error] = await getMerchantsAction();
  if (error) return notFound();

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/admin/products",
            label: "Products"
          },
          {
            href: "/admin/products/create",
            label: "Create Product"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Create a new product</h1>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <CreateProductForm merchants={result.data} />
          </div>
        </div>
      </div>
    </>
  );
}
