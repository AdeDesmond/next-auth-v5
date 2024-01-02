"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationToken } from "@/lib/mail";
import { sendEmail } from "@/lib/nodemail";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "email already in used",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });
  /**
   * Generate the verifivcation token with the email register with by the user
   * @function
   */
  const verificationToken = await generateVerificationToken(email);
  //await sendVerificationToken(verificationToken.email, verificationToken.token);
  /**
   * Send the confirmation email to the user so that they can click and then we can confirm the token
   * @function
   */
  await sendEmail(verificationToken.email, verificationToken.token);
  return {
    success: "Confirmation email sent",
  };
}
