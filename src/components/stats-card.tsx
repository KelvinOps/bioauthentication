import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}: StatsCardProps) {
  const changeColor = {
    increase: "text-green-600 dark:text-green-400",
    decrease: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card data-testid={`card-stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-stats-value`}>{value}</div>
        {change && (
          <p className={`text-xs ${changeColor} mt-1`} data-testid={`text-stats-change`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-stats-description`}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}