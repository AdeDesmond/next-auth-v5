"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendVerificationToken } from "@/lib/mail";
import { sendEmail, sendTwoFactorTokenEmail } from "@/lib/nodemail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  //check if we have the user with the email and password, if not we send an error
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "email or password is not correct, please try again" };
  }
  //check if the user has email verified, and if not we have to generate a verification token and send it to the user
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    // await sendVerificationToken(
    //   verificationToken.email,
    //   verificationToken.token
    // );
    await sendEmail(verificationToken.email, verificationToken.token);
    return {
      success: "Confirmation email sent",
    };
  }
  //check if the user has twoFactorebled which is a boolean and if we have the user with the email,
  if (existingUser?.isTwoFactorEnabled && existingUser?.email) {
    //check if the user has a code, and if they do then we want to get their two factor code by email
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: "invalid code",
        };
      }
      if (twoFactorToken.token !== code) {
        return {
          error: "Invalid code",
        };
      }
      //check if the code has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          error: "code has expired",
        };
      }
      //if they have the code then we want to delete the code
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      //check if the current use is already confirm
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      //if they exist already then we want to delete the twoFactor confirmation so that they can do it everytime they login
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      //then we create the two factor confirmation with the userId of the existing user
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
      //if there is no code then we generate a token and send so that the user can confirm again and the circle continous
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
    }

    return { twoFactor: true };
  }
  //then after that we can try to sign in the user
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials" };
        default:
          return { error: " something went wrong" };
      }
    }
    throw error;
  }
}
