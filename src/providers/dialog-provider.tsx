"use client";

import ElementFormDialog from "@/features/element/components/element-form-dialog";
import JoinWorkspaceDialog from "@/features/membership/components/join-workspace/join-workspace-dialog";
import AddWorkspaceItemDialog from "@/features/workspace-items/components/add-workspace-item-dialog";
import { useIsMounted } from "@/hooks/use-is-mounted";

const DialogProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <ElementFormDialog />
      <JoinWorkspaceDialog />
      <AddWorkspaceItemDialog />
    </>
  );
};

export default DialogProvider;
