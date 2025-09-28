"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { ShieldIcon, UsersIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const MembershipNavbar = () => {
  const { mode } = useParams();
  const router = useRouter();
  const { currentWorkspace } = useMyWorkspaces();

  if (!currentWorkspace) return null;

  return (
    <div className="sticky top-0 z-30">
      <div className="bg-background mx-auto flex items-center space-x-4 border-b">
        <div className="flex space-x-2 px-4 py-2">
          <Button
            className={cn(
              "flex items-center space-x-2",
              mode === "members"
                ? "text-white"
                : "border border-purple-300 text-purple-500 hover:bg-purple-100 hover:text-purple-500",
            )}
            variant={mode === "members" ? "purple" : "outline"}
            onClick={() =>
              router.push(
                `/workspace/${currentWorkspace.workspace.element.slug}/users/members`,
              )
            }
          >
            <UsersIcon className="h-4 w-4" />
            <span>Memberships</span>
          </Button>
          <Button
            className={cn(
              "flex items-center space-x-2",
              mode === "teams"
                ? "text-white"
                : "border border-purple-300 text-purple-500 hover:bg-purple-100 hover:text-purple-500",
            )}
            variant={mode === "teams" ? "purple" : "outline"}
            onClick={() =>
              router.push(
                `/workspace/${currentWorkspace.workspace.element.slug}/users/teams`,
              )
            }
          >
            <ShieldIcon className="h-4 w-4" />
            <span>Teams</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipNavbar;
