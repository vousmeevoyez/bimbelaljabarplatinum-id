"use client";

import type { Route } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { updateGalleryAction } from "@/actions/gallery-actions";
import { imageUploadSpecDescription } from "@/schemas/image-upload.schema";
import type { Gallery } from "@/db/schema";
import { ACCEPTED_IMAGE_TYPES } from "@/constants";


const formSchema = z.object({
  description: z.string().max(1000, "Max 1000 characters").optional(),
  image: z.instanceof(FileList).optional(),
})

type FormValues = z.infer<typeof formSchema>;

interface EditGalleryFormProps {
  gallery: Gallery;
}

export function EditGalleryForm({ gallery }: EditGalleryFormProps) {
  const router = useRouter();

  const { execute: updateGallery } = useServerAction(updateGalleryAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to update gallery item");
    },
    onStart: () => {
      toast.loading("Updating gallery item...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Gallery item updated successfully");
      router.push("/admin/galleries" as Route);
      router.refresh();
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: gallery.description || "",
      image: undefined,
    },
  });

  function onSubmit(data: FormValues) {
    updateGallery({
      galleryId: gallery.id,
      description: data.description || undefined,
      image: data.image && data.image.length > 0 ? data.image[0] : undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description (≤1000 chars)" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Optional description for your gallery item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => field.onChange(e.target.files)}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>{imageUploadSpecDescription()}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Update Gallery Item</Button>
      </form>
    </Form>
  );
}
