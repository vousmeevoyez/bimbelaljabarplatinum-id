import { getSessionFromCookie } from "@/utils/auth";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { Gallery } from "@/db/schema";
import { getGalleriesAction, deleteGalleryAction } from "@/actions/gallery-actions";
import { getPresignedR2Url } from "@/lib/s3";
import { PlusIcon, Images } from "lucide-react";
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

        {galleries.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-xl">You don&apos;t have any galleries yet</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Images className="h-16 w-16 text-muted-foreground/50" />
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button asChild>
                <Link href={"/admin/galleries/create" as Route}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create your first gallery
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="flex items-start gap-4">
<div className="relative w-full h-48 rounded-md overflow-hidden">
  <Image
    src={gallery.imageUrl}
    alt={`${gallery.description}`}
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                      {gallery.description}
                    </CardTitle>
                    <br />
                  </div>
                </CardHeader>
                <CardContent />
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/galleries/${gallery.id}/edit` as Route}>Edit</Link>
                  </Button>
                  <DeleteConfirmation id={gallery.id} name={gallery.description} action={deleteGalleryAction} type="gallery" />
                </CardFooter>
              </Card>
            ))}

            <Link href={"/admin/galleries/create" as Route}>
              <Card className="h-full border-dashed border-2 hover:border-primary transition-all">
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">Create a new gallery</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <PlusIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

      </div>
    </>
  );
}
