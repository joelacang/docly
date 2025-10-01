import { Users2Icon } from "lucide-react";
import SidebarSection from "./sidebar-section";
import { useMyTeams } from "@/providers/team-provider";
import TeamAvatar from "@/features/teams/components/team-avatar";
import { SIZE } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Colors } from "@/utils/colors";

const TeamSection = () => {
  const { myTeams } = useMyTeams();
  const { currentWorkspace } = useMyWorkspaces();

  const color = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];

  return (
    <SidebarSection name="TEAMS" icon={Users2Icon} color="PINK">
      <div className="space-y-2">
        {myTeams.length > 0 && (
          <Accordion
            type="multiple"
            defaultValue={[myTeams[0]?.team.id ?? ""]}
            className="space-y-6"
          >
            {myTeams.map((team) => (
              <AccordionItem
                key={team.team.id}
                value={team.team.id}
                className="border-border bg-card overflow-hidden rounded-lg border shadow-md transition-shadow"
              >
                <AccordionTrigger className="cursor-pointer px-3 py-2.5 hover:no-underline">
                  <div className="flex w-full flex-row items-center gap-3">
                    <TeamAvatar team={team.team} size={SIZE.SMALL} />
                    <p className="text-card-foreground text-sm font-medium">
                      {team.team.element.name}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-muted/50 border-border border-t px-3 py-2">
                  <div className="space-y-1 py-1">
                    {/* Example menu items - replace with your actual menu */}
                    <button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors">
                      <span className="bg-muted-foreground h-1 w-1 rounded-full"></span>
                      Overview
                    </button>
                    <button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors">
                      <span className="bg-muted-foreground h-1 w-1 rounded-full"></span>
                      Members
                    </button>
                    <button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors">
                      <span className="bg-muted-foreground h-1 w-1 rounded-full"></span>
                      Settings
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </SidebarSection>
  );
};

export default TeamSection;
