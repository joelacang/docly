"use client";
import Logo from "@/components/logo";
import { SIZE } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import UserMenu from "@/features/users/user-menu";
import {
  InboxIcon,
  MessageCircleIcon,
  MoonIcon,
  SearchIcon,
} from "lucide-react";
import NavbarButton from "./navbar-button";

const NavbarContent = () => {
  const { loggedUser } = useAuth();
  return (
    <div className="flex w-full flex-row items-center justify-between px-4 py-0.5">
      <div className="flex items-center justify-start gap-3">
        <Logo size={SIZE.SMALL} />
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <NavbarButton tooltip="Search" icon={SearchIcon} />
      </div>
    </div>
  );
};

export default NavbarContent;
