import Badge from "@/components/custom/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserBadge from "@/features/users/user-badge";
import type { ElementPreview } from "@/types/element";
import { ELEMENT_DISPLAYS } from "@/utils/elements";
import { Calendar, InfoIcon, TagIcon, UserIcon, UsersIcon } from "lucide-react";
import ElementDetail from "./element-detail";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Colors } from "@/utils/colors";
import DetailsCard from "./details-card";
import type { HTMLProps } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  element: ElementPreview;
  children?: React.ReactNode;
  className?: string;
}
const ElementDetailsCard = ({
  element,
  children,
  className,
  ...props
}: Props) => {
  const elementDisplay = ELEMENT_DISPLAYS[element.type];
  const { currentWorkspace } = useMyWorkspaces();
  const color =
    Colors[currentWorkspace?.workspace.element.color ?? "BLUE"].primary;
  return (
    <DetailsCard
      title={`${element.type} Details`}
      className={cn("@container w-full space-y-6", className)}
      {...props}
    >
      <ElementDetail color={color} title="Name" icon={elementDisplay.icon}>
        {element.name}
      </ElementDetail>

      <ElementDetail color={color} title="Description" icon={InfoIcon}>
        {element.description ?? "No Description"}
      </ElementDetail>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
        <ElementDetail color={color} title="Type" icon={TagIcon}>
          <Badge display={elementDisplay}>{element.type}</Badge>
        </ElementDetail>

        <ElementDetail color={color} title="Created At" icon={Calendar}>
          {element.createdAt.toLocaleDateString()}
        </ElementDetail>
      </div>

      <ElementDetail color={color} title="Created By" icon={UserIcon}>
        {element.createdBy ? (
          <UserBadge micro styled user={element.createdBy} />
        ) : (
          "No Information"
        )}
      </ElementDetail>

      <ElementDetail color={color} title="Owner/s" icon={UsersIcon}>
        {element.owners.length ? (
          <div className="flex flex-row flex-wrap gap-4">
            {element.owners.map((owner, index) => (
              <UserBadge micro styled key={index} user={owner} />
            ))}
          </div>
        ) : (
          <p>No Owners Found</p>
        )}
      </ElementDetail>
      {/* ID Footer */}
      <div className="space-y-6 border-t border-gray-200 pt-4">
        {children}
        <div className="space-y-1 pt-4">
          <p className="text-muted-foreground text-xs">
            Last Update:{" "}
            <span className="font-mono">
              {element.updatedAt.toLocaleString()}
            </span>
          </p>
          <p className="text-muted-foreground text-xs">
            Element Id: <span className="font-mono">{element.id}</span>
          </p>
        </div>
      </div>
    </DetailsCard>
  );
};

export default ElementDetailsCard;
