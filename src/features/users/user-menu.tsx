import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import UserAvatar from "./user-avatar";
import { Button } from "@/components/ui/button";
import { SIZE, type MenuItem } from "@/types";
import {
  InboxIcon,
  LightbulbIcon,
  LogOutIcon,
  MessageCircleIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { useTheme } from "next-themes";

const UserMenu = () => {
  const { loggedUser } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const { theme, resolvedTheme, setTheme } = useTheme();

  const items: MenuItem[] = [
    {
      id: "inbox",
      label: "Inbox",
      icon: InboxIcon,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircleIcon,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      hasSeparator: true,
    },
    {
      id: "switch-theme",
      label: `Switch to ${resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}`,
      icon: resolvedTheme === "light" ? MoonIcon : SunIcon,
      hasSeparator: true,
      action: () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOutIcon,
      action: () => {
        setIsPending(true);

        const signOutToast = toast.loading(`Signing Out...`);
        setTimeout(() => {
          authClient
            .signOut({})
            .then(() => {
              toast.success(`You have been logged out successfully.`);
              router.push("/auth");
            })
            .catch((error) => {
              toast.error(`Error logging out`);
              console.log("Error logging out", error);
            })
            .finally(() => {
              setIsPending(false);
              toast.dismiss(signOutToast);
            });
        }, 2000);
      },
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-fit rounded-full">
          <UserAvatar user={loggedUser} size={SIZE.MEDIUM} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 my-1 w-72">
        <DropdownMenuGroup className="flex flex-row items-center justify-start gap-3 p-1.5">
          <UserAvatar user={loggedUser} size={SIZE.LARGE} />
          <div>
            <p className="line-clamp-1 text-lg font-semibold">
              {loggedUser.name}
            </p>
            <p className="text-muted-foreground line-clamp-1 text-sm">
              {loggedUser.email}
            </p>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item) => (
            <MyDropdownMenuItem item={item} key={item.id} color="workspace" />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
