import { redirect, notFound } from "next/navigation";
import { getMerchantsAction } from "@/actions/merchant-actions";
import { getSessionFromCookie } from "@/utils/auth";
import type { Product } from "@/db/schema";
import { EditProductForm } from "@/components/products/edit-product-form";
import { getProductAction } from "@/actions/product-actions";
import { PageHeader } from "@/components/page-header";
import { getPresignedR2Url } from "@/lib/s3";

export const metadata = {
  title: "Edit Product",
  description: "Edit a new product for your organization",
};


interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/admin/products/create");
  }

  const [result, error] = await getProductAction({ productId: id });

  if (error) return notFound();

  const product: Product = {
    ...result.data,
    imageUrl: result.data.imageUrl ? (await getPresignedR2Url(result.data.imageUrl)) || "" : "",
    merchant: result.data.merchant
  };

  const [merchantResult, merchantError] = await getMerchantsAction();
  if (merchantError) return notFound();

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
            label: "Edit Product"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Edit a product</h1>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <EditProductForm product={product} merchants={merchantResult.data} />
          </div>
        </div>
      </div>
    </>
  );
}
