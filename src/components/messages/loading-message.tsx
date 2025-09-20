import { SIZE } from "@/types";
import Logo from "../logo";

interface Props {
  message?: string;
}
const LoadingMessage = ({ message = "Loading..." }: Props) => {
  return (
    <div className="flex w-full items-center justify-center py-8">
      <div className="space-y-1">
        <Logo size={SIZE.XLARGE} />
        <p className="text-primary text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingMessage;
