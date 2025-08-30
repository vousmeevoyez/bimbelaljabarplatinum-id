'use client';
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type DeleteResult = { success: boolean };

export function DeleteConfirmation<T extends { merchantId: string } | { productId: string }>({
  id, name, action, type = "merchant"
}: {
  id: string;
  name: string;
  action: (input: T) => Promise<[DeleteResult | null, unknown | null]>;
  type?: "merchant" | "product";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onConfirm = () =>
    startTransition(async () => {
      const [res] = await action((type === "merchant" ? { merchantId: id } : { productId: id }) as T);
      if (res?.success) router.refresh();
      // else handle toast/error if desired
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data may be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

