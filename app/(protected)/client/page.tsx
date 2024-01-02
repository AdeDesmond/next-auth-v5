"use client";

import { UserInfo } from "@/components/use-info";
import { useCurrentUser } from "@/hooks/use-current-user";

function ClientPage() {
  const user = useCurrentUser();
  return <UserInfo user={user} label="Client Component" />;
}

export default ClientPage;
