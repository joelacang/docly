import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import { useJoinWorkspaceDialog } from "../../hooks/use-join-workspace-dialog";
import { useState } from "react";
import { useDebounced } from "@/hooks/use-debounce";
import JoinWorkspaceSearchResult from "./join-workspace-search-result";
import AlertMessage from "@/components/messages/alert-message";
import { Mode } from "@/types";
import Centered from "@/components/layout/centered";
import InputIcon from "@/components/custom/InputIcon";

const JoinWorkspaceDialog = () => {
  const { open, onOpen, onClose, isPending } = useJoinWorkspaceDialog();
  const [searchText, setSearchText] = useState("");
  const debouncedText = useDebounced(searchText.trim(), 800);

  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Workspace</DialogTitle>
          <DialogDescription>
            Search for an available workspace to join. You&apos;ll be added as a
            member based on the workspace&apos;s access settings or after
            approval from an admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <InputIcon
            icon={SearchIcon}
            placeholder="Enter Workspace Name"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
          <div className="h-64 w-full overflow-y-auto rounded-lg border">
            {debouncedText ? (
              <JoinWorkspaceSearchResult searchValue={debouncedText} />
            ) : (
              <Centered>
                <AlertMessage
                  title="Enter Workspace Name to find workspaces for you to join."
                  icon={SearchIcon}
                />
              </Centered>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinWorkspaceDialog;
