"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/state/session";
import { useServerAction } from "zsa-react";
import { resendVerificationAction } from "@/app/(auth)/resend-verification.action";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS } from "@/constants";
import { Alert } from "@heroui/react"
import isProd from "@/utils/is-prod";
import { usePathname, useSearchParams } from "next/navigation";
import { Route } from "next";

const pagesToBypass: Route[] = [
  "/verify-email",
  "/sign-in",
  "/sign-up",
  "/",
  "/privacy",
  "/terms",
  "/reset-password",
  "/forgot-password"
];

export function EmailVerificationDialog() {
  const { session, fetchSession } = useSessionStore();
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);
  const [initialRenderTime] = useState<number>(Date.now());
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isVerifying, setIsVerifying] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update current time every second to show countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if we're on the verify-email page and set verifying state
  useEffect(() => {
    const hasToken = searchParams.get("token");
    if (pathname === "/verify-email" && hasToken) {
      setIsVerifying(true);
    } else {
      setIsVerifying(false);
    }
  }, [pathname, searchParams]);

  // Periodically refresh session when verifying to catch verification completion
  useEffect(() => {
    if (isVerifying && fetchSession) {
      const interval = setInterval(() => {
        fetchSession();
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isVerifying, fetchSession]);

  const { execute: resendVerification, status } = useServerAction(resendVerificationAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message);
    },
    onStart: () => {
      toast.loading("Sending verification email...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Verification email sent");
      setLastResendTime(Date.now());
    },
  });

  // Don't show the dialog if the user is not logged in, if their email is already verified,
  // or if we're on the verify-email page (unless we're actively verifying)
  if (
    !session
    || session.user.emailVerified
    || (pagesToBypass.includes(pathname as Route) && !isVerifying)
  ) {
    return null;
  }

  // Calculate time remaining for resend button
  const timeSinceLastResend = lastResendTime ? currentTime - lastResendTime : Infinity;
  const timeSinceInitialRender = currentTime - initialRenderTime;
  
  // Must wait at least 2 minutes from initial render OR 2 minutes from last resend
  const cooldownPeriod = 120000; // 2 minutes
  const canResend = timeSinceInitialRender >= cooldownPeriod && timeSinceLastResend >= cooldownPeriod;
  
  // Calculate remaining time for display
  const remainingTime = Math.max(
    cooldownPeriod - timeSinceInitialRender,
    lastResendTime ? cooldownPeriod - timeSinceLastResend : 0
  );
  const isLoading = status === "pending";

  return (
    <Dialog open modal onOpenChange={(newState) => {
      if (newState === false) {
        toast.warning("Please verify your email before you continue");
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your email</DialogTitle>
          <DialogDescription>
            Please verify your email address to access all features. We sent a verification link to {session.user.email}.
            The verification link will expire in {Math.floor(EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS / 3600)} hours.

            {!isProd && (
              <Alert
                color="warning"
                title="Development mode"
                description="You can find the verification link in the console."
                className="mt-4 mb-2"
              />
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => resendVerification()}
            disabled={isLoading || !canResend}
          >
            {isLoading
              ? "Sending..."
              : !canResend
                ? `Please wait ${Math.ceil(remainingTime / 1000)} seconds before resending`
                : "Resend verification email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

