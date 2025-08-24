"use server";

import { createServerAction, ZSAError } from "zsa";
import { getSessionFromCookie } from "@/utils/auth";
import { createId } from "@paralleldrive/cuid2";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getVerificationTokenKey } from "@/utils/auth-utils";
import { sendVerificationEmail } from "@/utils/email";
import { withRateLimit, RATE_LIMITS } from "@/utils/with-rate-limit";
import { EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS } from "@/constants";
import { z } from "zod";

export const resendVerificationAction = createServerAction()
  .input(z.void())
  .handler(async () => {
    return withRateLimit(
      async () => {
        const session = await getSessionFromCookie();

        if (!session) {
          throw new ZSAError(
            "NOT_AUTHORIZED",
            "Not authenticated"
          );
        }

        if (session?.user?.emailVerified) {
          throw new ZSAError(
            "PRECONDITION_FAILED",
            "Email is already verified"
          );
        }

        const { env } = getCloudflareContext();

        // Generate verification token
        const verificationToken = createId();
        const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS * 1000);

        if (!env?.NEXT_INC_CACHE_KV) {
          throw new Error("Can't connect to KV store");
        }

        // Save verification token in KV with expiration
        await env.NEXT_INC_CACHE_KV.put(
          getVerificationTokenKey(verificationToken),
          JSON.stringify({
            userId: session.user.id,
            expiresAt: expiresAt.toISOString(),
          }),
          {
            expirationTtl: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
          }
        );

        // Send verification email
        await sendVerificationEmail({
          email: session.user.email!,
          verificationToken,
          username: session.user.firstName || session.user.email!,
        });

        return { success: true };
      },
      RATE_LIMITS.EMAIL
    );
  });

