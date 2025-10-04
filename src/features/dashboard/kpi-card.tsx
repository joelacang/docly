import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Colors } from "@/utils/colors";
import type { Color } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import type React from "react";

interface Props {
  title: string;
  content: string;
  icon: LucideIcon;
  color: Color;
  subtitle: string;
}

const KPICard = ({ title, content, icon: Icon, color, subtitle }: Props) => {
  const palette = Colors[color];
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-3xl font-bold">{content}</p>
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          </div>
          <div
            className="rounded-full bg-[_var(--col-lightest)] p-3 dark:bg-[_var(--col-darkest)]"
            style={
              {
                "--col-lightest": palette.lightest,
                "--col-primary": palette.primary,
                "--col-darkest": palette.darkest,
              } as React.CSSProperties
            }
          >
            <Icon className="text-primary h-5 w-5" color={palette.primary} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
