import AlertMessage from "@/components/messages/alert-message";
import { Button } from "@/components/ui/button";
import { Mode } from "@/types";
import { PlusIcon, UserXIcon } from "lucide-react";

const NoTeamsMessage = () => {
  return (
    <AlertMessage
      title="This workspace doesn't have any teams."
      description="This workspace does not have any teams created. Add one right now."
      icon={UserXIcon}
      mode={Mode.ERROR}
      dashed
    >
      <div className="pt-4">
        <Button variant="blue">
          <PlusIcon />
          Add Team
        </Button>
      </div>
    </AlertMessage>
  );
};

export default NoTeamsMessage;
