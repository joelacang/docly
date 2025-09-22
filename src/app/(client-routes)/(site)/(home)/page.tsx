"use client";

import Centered from "@/components/layout/centered";
import PageHeader from "@/features/pages/page-header";
import WorkspaceLoader from "@/features/workspaces/components/workspace-loader";
import { useAuth } from "@/providers/auth-provider";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const SiteHomePage = () => {
  const { loggedUser } = useAuth();
  const { myWorkspaces } = useMyWorkspaces();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <PageHeader
        title={`Welcome, ${loggedUser.name}!`}
        subtitle="Ready to continue your journey? Explore your dashboard, check recent activity, and discover what's new today."
      />
      <Centered>
        <WorkspaceLoader />
      </Centered>
    </div>
  );
};

export default SiteHomePage;
