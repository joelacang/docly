"use client";
import SidebarSheet from "@/features/sidebar/components/sidebar-sheet";
import { useIsMounted } from "@/hooks/use-is-mounted";

const SheetProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <SidebarSheet />
    </>
  );
};

export default SheetProvider;
