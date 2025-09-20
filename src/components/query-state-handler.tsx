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
  children,
}: QueryStateHandlerProps<T>) {
  if (isLoading) {
    if (typeof loadingLabel === "string") {
      return (
        <Centered>
          <Loading label={loadingLabel} />
        </Centered>
      );
    } else {
      return loadingLabel;
    }
  }

  if (isError) {
    return (
      <Centered>
        <AlertMessage
          title={errorTitle ?? "Error Performing Action"}
          description={errorMessage ?? "An unknown error occurred."}
          mode={Mode.ERROR}
        />
      </Centered>
    );
  }

  if (!data || (Array.isArray(data) && !data.length)) {
    return (
      <Centered>
        <AlertMessage
          title={emptyTitle ?? "No Result Found."}
          description={
            emptyDescription ??
            "Sorry, there are no results with your request. Try again later."
          }
          mode={Mode.DEFAULT}
          icon={SearchXIcon}
        />
      </Centered>
    );
  }

  return <div>{children(data)}</div>;
}
