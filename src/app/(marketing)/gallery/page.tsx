import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import type { Gallery } from "@/db/schema";
import { getGalleriesAction } from "@/actions/gallery-actions";
import { GalleryDisplay } from "@/components/galleriesgallery-display";
import { getPresignedR2Url } from "@/lib/s3";

export const metadata = {
  title: "Gallery",
  description: "View our gallery of images",
};

export default async function PublicGalleryPage() {
  // Get all gallery items
  const [result, error] = await getGalleriesAction({});

  let galleries: Gallery[] = [];
  if (result?.success && result.data) {
    galleries = await Promise.all(
      result.data.map(async (data) => {
        let imageUrl = "";
        if (data.imageUrl) imageUrl = (await getPresignedR2Url(data.imageUrl)) || "";
        return { ...data, imageUrl };
      })
    );
  }
  if (error) return notFound();

  return (
    <>
      <PageHeader items={[{ href: "/gallery", label: "Gallery" }]} />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Gallery</h1>
          <p className="text-muted-foreground mt-2">Browse our collection of images</p>
        </div>

        <GalleryDisplay galleries={galleries} showActions={false} />
      </div>
    </>
  );
}
