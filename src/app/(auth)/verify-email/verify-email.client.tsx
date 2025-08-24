"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { verifyEmailAction } from "./verify-email.action";
import { verifyEmailSchema } from "@/schemas/verify-email.schema";
import { Spinner } from "@/components/ui/spinner";
import { REDIRECT_AFTER_SIGN_IN } from "@/constants";

export default function VerifyEmailClientComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasCalledVerification = useRef(false);

  const { execute: handleVerification, isPending, error } = useServerAction(verifyEmailAction, {
    onError: ({ err }) => {
      toast.dismiss();
      toast.error(err.message || "Failed to verify email");
    },
    onStart: () => {
      toast.loading("Verifying your email...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Email verified successfully");

      router.refresh();

      setTimeout(() => {
        router.push(REDIRECT_AFTER_SIGN_IN);
      }, 500);
    },
  });

  useEffect(() => {
    if (token && !hasCalledVerification.current) {
      const result = verifyEmailSchema.safeParse({ token });
      if (result.success) {
        hasCalledVerification.current = true;
        handleVerification(result.data);
      } else {
        toast.error("Invalid verification token");
        router.push("/sign-in");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="large" />
              <CardTitle>Verifying Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification failed</CardTitle>
            <CardDescription>
              {error?.message || "Failed to verify email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in")}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid verification link</CardTitle>
            <CardDescription>
              The verification link is invalid. Please request a new verification email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in")}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
