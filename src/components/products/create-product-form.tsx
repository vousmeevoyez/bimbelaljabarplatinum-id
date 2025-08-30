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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { createProductAction } from "@/actions/product-actions";

const formSchema = z.object({
  merchantId: z.string().min(1, "Merchant is required"),
  name: z.string().min(1, "Product name is required").max(255, "Max 255 characters"),
  description: z.string().min(1, "Description is required").max(255, "Max 255 characters"),
  url: z.string().url("Must be a valid URL").max(255, "Max 255 characters"),
  priceCents: z.coerce.number().int("Must be an integer").nonnegative("Must be ≥ 0"),
});

type FormValues = z.infer<typeof formSchema>;
type MerchantOption = { id: string; name: string };

export function CreateProductForm({ merchants }: { merchants: MerchantOption[] }) {
  const router = useRouter();

  const { execute: createProduct } = useServerAction(createProductAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to create product");
    },
    onStart: () => {
      toast.loading("Creating product...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Product created successfully");
      router.push(`/dashboard/products` as Route);
      router.refresh();
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantId: "",
      name: "",
      description: "",
      url: "",
      priceCents: 0,
    },
  });

  function onSubmit(data: FormValues) {
    createProduct({
      merchantId: data.merchantId,
      name: data.name,
      description: data.description,
      url: data.url,
      priceCents: data.priceCents,
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a merchant" /></SelectTrigger>
                  <SelectContent>
                    {merchants.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select the merchant that owns this product</FormDescription>
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
              <FormDescription>A unique name for your product (≤255 chars)</FormDescription>
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

        <Button type="submit" className="w-full">Create Product</Button>
      </form>
    </Form>
  );
}
