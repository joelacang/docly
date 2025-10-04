import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  settings?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
}
const DetailsCard = ({
  title,
  description,
  settings,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between text-xl font-semibold">
          {title}
          <div>{settings}</div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="@container w-full space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
