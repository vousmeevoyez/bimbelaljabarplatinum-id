import { getSessionFromCookie } from "@/utils/auth";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { Gallery } from "@/db/schema";
import { getGalleriesAction, deleteGalleryAction } from "@/actions/gallery-actions";
import { GalleryDisplay } from "@/components/galleries/gallery-display";
import { getPresignedR2Url } from "@/lib/s3";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export const metadata = {
  title: "Gallery",
  description: "Manage your gallery items",
};

export default async function GalleryIndexPage() {
  const session = await getSessionFromCookie();

  if (!session) redirect("/sign-in?redirect=/admin/gallery" as Route);

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

  const createHref = "/admin/galleries/create" as Route;

  return (
    <>
      <PageHeader items={[{ href: "/admin/gallery", label: "Gallery" }]} />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Gallery</h1>
            <p className="text-muted-foreground mt-2">Manage your gallery items</p>
          </div>
          <Button asChild>
            <Link href={createHref}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Gallery Item
            </Link>
          </Button>
        </div>

        <GalleryDisplay galleries={galleries} showActions={true} />
      </div>
    </>
  );
}
