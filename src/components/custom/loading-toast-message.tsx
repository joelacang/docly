import { Loader2Icon } from "lucide-react";

interface Props {
  message?: string;
}
const LoadingToastMessage = ({ message = "Loading..." }: Props) => {
  return (
    <div className="bg-card flex w-full max-w-lg flex-col gap-4 rounded-xl border p-4 shadow-lg">
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="py-2">
          <Loader2Icon className="text-primary size-6 animate-spin" />
        </div>

        <div className="flex flex-1 flex-col">
          <h4 className="text-primary font-semibold">{message}</h4>
        </div>
      </div>
    </div>
  );
};

export default LoadingToastMessage;
