"use client";

import type { Route } from "next";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useServerAction } from "zsa-react";
import { updateMerchantAction } from "@/actions/merchant-actions";

const twoMiB = 2 * 1024 * 1024;

const baseSchema = z.object({
  name: z.string().min(1, "Merchant name is required").max(100, "Merchant name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  logo: z
    .instanceof(FileList)
    .transform(l => (l && l.length ? l[0] : null))
    .refine(f => !f || f.type.startsWith("image/"), { message: "Only image files are allowed" })
    .refine(f => !f || f.size <= twoMiB, { message: "File must be 2MB or smaller" })
    .nullable()
    .optional(),
});

const editSchema = baseSchema.extend({ removeLogo: z.boolean().default(false).optional() });

type EditValues = z.infer<typeof editSchema>;

export type Merchant = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
};

export function EditMerchantForm({ merchant }: { merchant: Merchant }) {
  const router = useRouter();

  const { execute: updateMerchant } = useServerAction(updateMerchantAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to update merchant");
    },
    onStart: () => {
      toast.loading("Updating merchant...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Merchant updated successfully");
      router.push(`/dashboard/merchants` as Route);
      router.refresh();
    }
  });

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: merchant.name,
      description: merchant.description,
      logo: undefined,
    },
  });

  function onSubmit(data: EditValues) {
    updateMerchant({
      merchantId: merchant.id,
      name: data.name,
      description: data.description || undefined,
      logo: data.logo ?? undefined,
    })
  }

  const hasExistingLogo = Boolean(merchant.logoUrl);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Merchant name" {...field} />
              </FormControl>
              <FormDescription>Enter the display name for this merchant.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional description" {...field} />
              </FormControl>
              <FormDescription>Provide an optional description (max 1000 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo management */}
        <div className="space-y-3">
          {hasExistingLogo && (
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                {merchant.logoUrl ? (
                  <Image src={merchant.logoUrl} alt="Current logo" fill className="object-contain" />
                ) : null}
              </div>
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => field.onChange(e.target.files)}
                    ref={field.ref}
                    key={form.formState.submitCount}
                  />
                </FormControl>
                <FormDescription>
                  {hasExistingLogo ? "Choose a new image to replace the current logo" : "Optional logo for your merchant"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>
          )}

        </div>

        <div className="flex gap-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              form.reset({
                name: merchant.name,
                description: undefined,
                logo: undefined,
                removeLogo: false,
              })
            }
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
