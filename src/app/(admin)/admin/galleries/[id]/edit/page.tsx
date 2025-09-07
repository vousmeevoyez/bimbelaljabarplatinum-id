import { getSessionFromCookie } from "@/utils/auth";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { EditGalleryForm } from "@/components/galleries/edit-gallery-form";
import { getGalleryAction } from "@/actions/gallery-actions";
import { getPresignedR2Url } from "@/lib/s3";
import type { Route } from "next";

export const metadata = {
  title: "Edit Gallery Item",
  description: "Edit your gallery item",
};

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const session = await getSessionFromCookie();
  const resolvedParams = await params;
  const galleryId = resolvedParams.id;

  if (!session) redirect(`/sign-in?redirect=/admin/gallery/${galleryId}/edit` as Route);

  // Get the gallery item
  const [result, error] = await getGalleryAction({ galleryId });

  if (error || !result?.success || !result.data) {
    return notFound();
  }

  let gallery = result.data;
  if (gallery.imageUrl) {
    const imageUrl = await getPresignedR2Url(gallery.imageUrl);
    gallery = { ...gallery, imageUrl: imageUrl || "" };
  }

  return (
    <>
      <PageHeader
        items={[
          { href: "/admin/galleries", label: "Gallery" },
          { href: `/admin/galleries/${galleryId}/edit`, label: "Edit" }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Edit Gallery Item</h1>
          <p className="text-muted-foreground mt-2">Update your gallery item</p>
        </div>

        <div className="max-w-2xl">
          <EditGalleryForm gallery={gallery} />
        </div>
      </div>
    </>
  );
}
