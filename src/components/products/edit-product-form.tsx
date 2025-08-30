"use client";

import type { Route } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/db/schema";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { updateProductAction } from "@/actions/product-actions";
import { imageUploadSchema, ACCEPTED_IMAGE_TYPES, imageUploadSpecDescription } from "@/schemas/image-upload.schema";

const formSchema = z.object({
  merchantId: z.string().min(1, "Merchant is required"),
  name: z.string().min(1, "Product name is required").max(255, "Max 255 characters"),
  description: z.string().min(1, "Description is required").max(255, "Max 255 characters"),
  url: z.string().url("Must be a valid URL").max(255, "Max 255 characters"),
  priceCents: z.coerce.number().int("Must be an integer").nonnegative("Must be ≥ 0"),
}).merge(imageUploadSchema);

type FormValues = z.infer<typeof formSchema>;
type MerchantOption = { id: string; name: string };

export function EditProductForm({
  merchants,
  product
}: {
  merchants: MerchantOption[];
  product: Product;
}) {
  const router = useRouter();

  const { execute: updateProduct } = useServerAction(updateProductAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to update product");
    },
    onStart: () => {
      toast.loading("Saving changes...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Product updated");
      router.push(`/dashboard/products` as Route);
      router.refresh();
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantId: product.merchantId,
      name: product.name,
      description: product.description,
      url: product.url,
      priceCents: product.priceCents,
    },
  });

  function onSubmit(data: FormValues) {
    updateProduct({
      productId: product.id,
      merchantId: data.merchantId,
      name: data.name,
      description: data.description,
      url: data.url,
      priceCents: data.priceCents,
      // If no new file selected, send undefined so backend keeps the current image
      image: data.image && (data.image as unknown as FileList)?.length ? data.image : undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="merchantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a merchant" /></SelectTrigger>
                  <SelectContent>
                    {merchants.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Change the owning merchant if needed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl><Input placeholder="Enter product name" {...field} /></FormControl>
              <FormDescription>≤255 characters</FormDescription>
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
                <Textarea placeholder="Brief description (≤255 chars)" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product URL</FormLabel>
              <FormControl><Input placeholder="https://example.com/product" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (cents)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>Integer amount in cents (e.g., 1299 for $12.99)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          {product.imageUrl ? (
            <div className="flex items-center gap-4 rounded-lg border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
              <div className="text-sm text-muted-foreground">
                Current image. Upload a new file to replace it.
              </div>
            </div>
          ) : null}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Replace Image</FormLabel>
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
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">Save Changes</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
