"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    SiWhatsapp as Whatsapp,
  } from 'react-icons/si';

interface FloatingChatButtonProps {
  className?: string;
}

export function FloatingChatButton({ className }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChatClick = () => {
    // You can integrate with your preferred chat service here
    // For example: Intercom, Zendesk, Crisp, or a custom chat widget
    window.open("https://wa.me/6282141235350", "_blank");
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Chat Widget */}
      {isOpen && (
        <Card className="mb-4 w-80 max-w-[calc(100vw-2rem)] bg-background shadow-lg border animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Butuh Bantuan?</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Chat dengan tim dukungan kami untuk bantuan instan.
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleChatClick}
                className="w-full"
                size="sm"
              >
                <Whatsapp className="mr-2 h-4 w-4" />
                Chat WhatsApp
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-primary hover:bg-primary/90",
            // Responsive sizing
            "h-12 w-12 sm:h-14 sm:w-14",
            // Mobile-specific positioning
            "bottom-4 right-4 sm:bottom-6 sm:right-6"
          )}
          size="lg"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}
    </div>
  );
}
