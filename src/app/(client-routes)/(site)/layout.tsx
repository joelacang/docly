import { AuthProvider } from "@/providers/auth-provider";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import type React from "react";

interface Props {
  children: React.ReactNode;
}
const AuthCheck = ({ children }: Props) => {
  return (
    <AuthProvider>
      <div className="w-full">{children}</div>
    </AuthProvider>
  );
};

export default AuthCheck;
