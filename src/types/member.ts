import type { MembershipRole, MembershipStatus } from "@prisma/client";
import type { User } from "./user";

export type MemberPreview = {
  id: string;
  member: User;
  role: MembershipRole;
  status: MembershipStatus;
  joinDate: Date | null;
};

export type MemberOption = {
  value: string;
  label: string;
  member: User;
};
