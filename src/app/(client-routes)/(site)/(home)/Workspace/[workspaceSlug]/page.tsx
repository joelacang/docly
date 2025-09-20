"use client";
import ToastMessage from "@/components/custom/toast-message";
import { Button } from "@/components/ui/button";
import WorkspaceBadge from "@/features/workspaces/components/workspace-badge";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Mode } from "@/types";
import { ArrowRightIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const ElementHomePage = () => {
  const { myWorkspaces, currentWorkspace, setCurrentWorkspace } =
    useMyWorkspaces();
  const { workspaceSlug } = useParams();

  useEffect(() => {
    const found = myWorkspaces.find(
      (w) => w.workspace.element.slug === workspaceSlug,
    );

    if (found) {
      setCurrentWorkspace(found);
    }
  }, [myWorkspaces, workspaceSlug]);
  return <div></div>;
};

export default ElementHomePage;
