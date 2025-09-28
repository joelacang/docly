import Dock from "@/features/dock/components/dock";
import { AuthProvider } from "@/providers/auth-provider";
import DialogProvider from "@/providers/dialog-provider";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import type React from "react";

interface Props {
  children: React.ReactNode;
}
const SiteLayout = ({ children }: Props) => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <DialogProvider />
        <div className="flex h-svh w-full flex-row">
          <div className="sticky top-0 left-0 min-h-full">
            <Dock />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

export default SiteLayout;
