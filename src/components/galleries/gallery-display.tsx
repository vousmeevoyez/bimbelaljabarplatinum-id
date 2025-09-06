"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { deleteGalleryAction } from "@/actions/gallery-actions";
import { Eye, EyeOff, Calendar, User, Tag } from "lucide-react";
import type { Route } from "next";
import type { Gallery } from "@/db/schema";

interface GalleryDisplayProps {
  galleries: Gallery[];
  showActions?: boolean;
}

export function GalleryDisplay({ galleries, showActions = true }: GalleryDisplayProps) {
  if (galleries.length === 0) {
    return (
      <div className="text-center border-dashed border-2 p-12 rounded-md">
        <div className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl">No gallery items found</h2>
        <p className="text-muted-foreground mt-2">
          {showActions ? "Create your first gallery item to get started" : "Check back later for new content"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries.map((gallery) => (
        <Card key={gallery.id} className="overflow-hidden">
          <div className="aspect-video relative">
            {gallery.imageUrl ? (
              <Image
                src={gallery.imageUrl}
                alt={gallery.description || "Gallery image"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="h-16 w-16 text-muted-foreground/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          <CardHeader className="pb-3">
            {gallery.description && (
              <CardDescription className="line-clamp-3">
                {gallery.description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(gallery.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {showActions && (
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/gallery/${gallery.id}/edit` as Route}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteConfirmation
                    id={gallery.id}
                    name={gallery.description || "Gallery item"}
                    action={deleteGalleryAction}
                    type="gallery item"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
