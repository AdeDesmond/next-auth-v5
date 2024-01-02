import React from "react";
import { NavBar } from "./_components/nav-bar";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <NavBar />
      {children}
    </div>
  );
}

export default ProtectedLayout;
