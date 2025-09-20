import { RefreshCwIcon } from "lucide-react";
import InfoMessage from "./info-message";
import { Button } from "../ui/button";

interface Props {
  message: string;
  description?: string;
}
const ErrorMessage = ({ message, description }: Props) => {
  return (
    <InfoMessage
      imageUrl="/images/error.png"
      message={message}
      mode="error"
      className="space-y-8"
    >
      <p className="text-destructive line-clamp-3 font-sans text-sm">
        {description}
      </p>
      <Button
        variant="destructive"
        className="bg-gradient-to-br from-red-400 to-red-700"
      >
        <RefreshCwIcon />
        Try Again
      </Button>
    </InfoMessage>
  );
};

export default ErrorMessage;
