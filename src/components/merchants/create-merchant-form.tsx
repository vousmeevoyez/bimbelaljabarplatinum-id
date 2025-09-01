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
import { createMerchantAction } from "@/actions/merchant-actions";
import { imageUploadSchema, ACCEPTED_IMAGE_TYPES, imageUploadSpecDescription } from "@/schemas/image-upload.schema";

const formSchema = z.object({
  name: z.string().min(1, "Merchant name is required").max(100, "Merchant name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
}).extend({
  image: imageUploadSchema.shape.image.nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateMerchantForm() {
  const router = useRouter();

  const { execute: createMerchant } = useServerAction(createMerchantAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to create merchant");
    },
    onStart: () => {
      toast.loading("Creating merchant...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Merchant created successfully");
      router.push(`/admin/merchants` as Route);
      router.refresh();
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", image: undefined },
  });

  function onSubmit(data: FormValues) {
    createMerchant({
      name: data.name,
      description: data.description?? undefined,
      logo: data.image ?? undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant Name</FormLabel>
              <FormControl><Input placeholder="Enter merchant name" {...field} /></FormControl>
              <FormDescription>A unique name for your merchant</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a brief description of your merchant" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Optional description of your merchant&apos;s purpose</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => field.onChange(e.target.files)}
                  // RHF file inputs should not bind `value`; rely on ref for registration:
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>{`Optional logo for your merchant.`}<br/> {imageUploadSpecDescription()}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Merchant</Button>
      </form>
    </Form>
  );
}

