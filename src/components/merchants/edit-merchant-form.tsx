"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { updateMerchantAction } from "@/actions/merchant-actions";
import { useEffect } from "react";

const twoMiB = 2 * 1024 * 1024;

const baseSchema = z.object({
  name: z.string().min(1, "Merchant name is required").max(100, "Merchant name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  logo: z
    .instanceof(FileList)
    .transform(l => (l && l.length ? l[0] : null)) // -> File | null
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
  logoUrl?: string | null;
};


export function EditMerchantForm({ merchant }: { merchant: Merchant }) {
  const router = useRouter();
  const { execute: updateMerchant } = useServerAction(updateMerchantAction, { /* ...unchanged... */ });

  // 2) DO NOT seed the file input with the URL. Leave logo undefined.
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: merchant.name,
      description: undefined,  // or merchant.description if you have it
      logo: undefined,         // 🔴 was merchant.logoUrl
      removeLogo: false,
    },
  });

  // 3) If "removeLogo" is toggled on, clear any selected file.
  const removeLogo = form.watch("removeLogo");
  useEffect(() => {
    if (removeLogo) form.setValue("logo", undefined, { shouldDirty: true });
  }, [removeLogo, form]);

  function onSubmit(data: EditValues) {
    updateMerchant({
      id: merchant.id,
      name: data.name,
      description: data.description || undefined,
      logo: data.removeLogo ? null : (data.logo ?? undefined),
    });
  }

  const hasExistingLogo = Boolean(merchant.logoUrl);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* name + description fields unchanged */}

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
                name="removeLogo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remove current logo</FormLabel>
                      <FormDescription>If checked, the existing logo will be deleted on save.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* 4) Keep the file input uncontrolled value-wise; only pass onChange/ref */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{hasExistingLogo ? "Replace Logo" : "Logo"}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    ref={field.ref}
                    disabled={removeLogo}
                    // Optional: force-clears the native input when reset() is called
                    key={form.formState.submitCount + (removeLogo ? "-rm" : "-keep")}
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

        <div className="flex gap-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          {/* 5) Ensure reset() doesn't re-inject a URL into logo */}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              form.reset({
                name: merchant.name,
                description: undefined, // or merchant.description
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
