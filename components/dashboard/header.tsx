import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Flag, Timer } from "lucide-react";

const stats = [
  {
    name: "Total Races",
    value: "14",
    icon: Flag,
    change: "+2 from last season",
  },
  {
    name: "Active Drivers",
    value: "22",
    icon: Users,
    change: "Full grid capacity",
  },
  {
    name: "Championship Leader",
    value: "Theo Pourchaire",
    icon: Trophy,
    change: "+12 points ahead",
  },
  {
    name: "Fastest Lap",
    value: "1:43.521",
    icon: Timer,
    change: "Monaco GP - Lap 28",
  },
];

export function DashboardHeader() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <h4 className="mt-2 text-2xl font-bold">{stat.value}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <stat.icon className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}