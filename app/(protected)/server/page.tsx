import { UserInfo } from "@/components/use-info";
import { currentUser } from "@/lib/auth";
import React from "react";

async function ServerPage() {
  const user = await currentUser();
  return <UserInfo user={user} label="Server Component" />;
}

export default ServerPage;
