import MembershipNavbar from "@/features/membership/components/membership-navbar";

interface Props {
  children: React.ReactNode;
}
const MembershipPageLayout = ({ children }: Props) => {
  return (
    <div>
      <MembershipNavbar />
      <div className="px-4 py-6 lg:px-8">{children}</div>
    </div>
  );
};

export default MembershipPageLayout;
