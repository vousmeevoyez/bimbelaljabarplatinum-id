// app/galleries/page.tsx
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getGalleriesAction } from "@/actions/gallery-actions";
import { getPresignedR2Url } from "@/lib/s3";
import { GalleryGrid } from "@/components/galleries/gallery-grid";

export const revalidate = 0;

// Extended gallery type for display purposes
type GalleryDisplay = {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  updateCounter: number | null;
};

export default async function GalleriesIndexPage() {
  const [result, error] = await getGalleriesAction({limit: 20});
  let galleries: GalleryDisplay[] = [];

  if (result?.success && result.data) {
    galleries = await Promise.all(
      result.data.map(async (data) => {
        let src = "/placeholder-image.svg"; // fallback image
        if (data.imageUrl) {
          const presignedUrl = await getPresignedR2Url(data.imageUrl);
          if (presignedUrl) src = presignedUrl;
        }
        
        return {
          id: data.id,
          src,
          title: data.description || "Untitled Gallery",
          subtitle: undefined,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          updateCounter: data.updateCounter,
        };
      })
    );
  }
  if (error) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Separator />

      {/* Empty state */}
      {galleries.length === 0 ? (
        <section className="rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Belum ada foto</h3>
          <p className="text-sm text-muted-foreground">Tambahkan foto untuk memulai.</p>
        </section>
      ) : null}

      {/* Gallery Grid with Modal Functionality */}
      <GalleryGrid galleries={galleries} />
    </main>
  );
}
