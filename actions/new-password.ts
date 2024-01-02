"use server";
import { getPassworResetTokenByToken } from "@/data/password-reset-token";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
  if (!token) {
    return { error: "missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "invalid password",
    };
  }

  const { password } = validatedFields.data;

  //check and verify the token from our db,

  /**
   * function to check if we aleready have the token in our database
   */
  const exisitingToken = await getPassworResetTokenByToken(token);

  if (!exisitingToken) {
    return {
      error: "invalid token",
    };
  }

  //check if the token has expired

  const hasExpired = new Date(exisitingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "token has expired",
    };
  }

  //check the existing user

  const existingUser = await getUserByEmail(exisitingToken.email);

  if (!existingUser) {
    return {
      error: "Email does not exist",
    };
  }
  //Hash the password in order to store in the database
  const hashPassword = bcrypt.hashSync(password, 10);
  //update the password and store it as a hashed password in the database
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });

  //Delete the password reset token from the db

  await db.passwordResetToken.delete({
    where: {
      id: exisitingToken.id,
    },
  });

  return {
    success: "Password successfully updated",
  };
}
