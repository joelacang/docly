"use client";

import CollectionFormDialog from "@/features/collections/components/collection-form-dialog";
import FolderFormDialog from "@/features/folders/components/folder-form-dialog";
import JoinWorkspaceDialog from "@/features/membership/components/join-workspace/join-workspace-dialog";
import TeamFormDialog from "@/features/teams/components/team-form-dialog";
import AddWorkspaceItemDialog from "@/features/workspace-items/components/add-workspace-item-dialog";
import CreateWorkspaceDialog from "@/features/workspaces/components/create-workspace-dialog";
import { useIsMounted } from "@/hooks/use-is-mounted";

const DialogProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <JoinWorkspaceDialog />
      <AddWorkspaceItemDialog />
      <CreateWorkspaceDialog />
      <FolderFormDialog />
      <CollectionFormDialog />
      <TeamFormDialog />
    </>
  );
};

export default DialogProvider;
