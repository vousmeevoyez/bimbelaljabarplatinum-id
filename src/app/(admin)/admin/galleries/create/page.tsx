import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { CreateGalleryForm } from "@/components/galleries/create-gallery-form";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Create Gallery",
  description: "Create a new merchant for your organization",
};

export default async function CreateGalleryPage() {
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/admin/merchants/create");
  }

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/admin/galleries",
            label: "Galleries"
          },
          {
            href: "/admin/galleries/create",
            label: "Create Gallery"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Create a new gallery</h1>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <CreateGalleryForm />
          </div>
        </div>
      </div>
    </>
  );
}
