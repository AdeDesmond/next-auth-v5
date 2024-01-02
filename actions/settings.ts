"use server";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/nodemail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";

export async function settings(values: z.infer<typeof SettingsSchema>) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: "Unathorized",
    };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return {
        error: "Email already in used",
      };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendEmail(verificationToken.email, verificationToken.token);

    return {
      success: "verification email sent!!",
    };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = bcrypt.compareSync(values.password, dbUser.password);
    if (!passwordMatch) {
      return {
        error: "Incorrect password",
      };
    }

    const hashPassword = bcrypt.hashSync(values.newPassword, 10);
    values.password = hashPassword;
    values.newPassword = undefined;
  }

  try {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return {
    success: "Settings updated",
  };
}
