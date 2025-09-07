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
import { createGalleryAction } from "@/actions/gallery-actions";
import { imageUploadSpecDescription } from "@/schemas/image-upload.schema";
import { ACCEPTED_IMAGE_TYPES } from "@/constants";

const formSchema = z.object({
  description: z.string().max(2500, "Description is too long").optional(),
  image: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateGalleryForm() {
  const router = useRouter();

  const { execute: create } = useServerAction(createGalleryAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to create gallery");
    },
    onStart: () => {
      toast.loading("Creating gallery...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Gallery created successfully");
      router.push(`/admin/galleries` as Route);
      router.refresh();
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", image: undefined },
  });

  function onSubmit(data: FormValues) {
    if (!data.image || data.image.length === 0) {
      toast.error("Please select an image");
      return;
    }
    
    create({
      description: data.description,
      image: data.image[0],
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
                <Textarea placeholder="Enter a brief description of your photo" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Optional description of your photo&apos;s purpose</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => field.onChange(e.target.files)}
                  // RHF file inputs should not bind `value`; rely on ref for registration:
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>{imageUploadSpecDescription()}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Gallery</Button>
      </form>
    </Form>
  );
}

