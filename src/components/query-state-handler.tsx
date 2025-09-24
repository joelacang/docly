import { Mode, type QueryStateHandlerProps } from "@/types";
import Centered from "./layout/centered";
import AlertMessage from "./messages/alert-message";
import { SearchXIcon } from "lucide-react";
import Loading from "./loading";

export function QueryStateHandler<T>({
  isLoading,
  isError,
  data,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorMessage,
  emptyContent,
  children,
}: QueryStateHandlerProps<T>) {
  if (isLoading) {
    if (typeof loadingLabel === "string") {
      return (
        <Centered className="py-8">
          <Loading label={loadingLabel} />
        </Centered>
      );
    } else {
      return loadingLabel;
    }
  }

  if (isError) {
    return (
      <AlertMessage
        title={errorTitle ?? "Error Performing Action"}
        description={errorMessage ?? "An unknown error occurred."}
        mode={Mode.ERROR}
      />
    );
  }

  if (
    !data ||
    (Array.isArray(data) && !data.length && (emptyTitle || emptyDescription))
  ) {
    return (
      <div className="px-4">
        <AlertMessage
          title={emptyTitle ?? "No Result Found."}
          description={
            emptyDescription ??
            "Sorry, there are no results with your request. Try again later."
          }
          icon={SearchXIcon}
        >
          {emptyContent}
        </AlertMessage>
      </div>
    );
  }

  return <div>{children(data)}</div>;
}
