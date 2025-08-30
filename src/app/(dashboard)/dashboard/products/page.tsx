import { getSessionFromCookie } from "@/utils/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getProductsAction, deleteProductAction } from "@/actions/product-actions";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { getPresignedR2Url } from "@/lib/s3";
import { ShoppingBag, PlusIcon } from "lucide-react";
import type { Route } from "next";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export const metadata = {
  title: "My Products",
  description: "Manage your products",
};

export default async function ProductsIndexPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect("/sign-in?redirect=/dashboard/products");

  const [result, error] = await getProductsAction();
  let products: ProductItem[] = [];
  if (result?.success && result.data) {
    products = await Promise.all(
      result.data.map(async (data) => {
        let logoUrl = "";
        if (data.logoUrl) logoUrl = await getPresignedR2Url(data.logoUrl);
        return { ...data, logoUrl };
      })
    );
  }
  if (error) return notFound();

  return (
    <>
      <PageHeader items={[{ href: "/dashboard/products", label: "Products" }]} />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Products</h1>
            <p className="text-muted-foreground mt-2">Manage your products</p>
          </div>
          <Button asChild>
            <Link href={"/dashboard/products/create" as Route}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Product
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center border-dashed border-2 p-12 rounded-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h2 className="mt-4 text-xl">You don&apos;t have any products yet</h2>
            <Button asChild className="mt-6">
              <Link href={"/dashboard/products/create" as Route}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create your first product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Logo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-3">
                      {product.logoUrl ? (
                        <img src={product.logoUrl} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <Link href={`/dashboard/products/${product.id}` as Route} className="hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-3">{product.slug}</td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/products/${product.id}/edit` as Route}>Edit</Link>
                      </Button>
                      <DeleteConfirmation id={product.id} name={product.name} action={deleteProductAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
