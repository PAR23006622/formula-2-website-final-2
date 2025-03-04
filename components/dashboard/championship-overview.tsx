"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import "@/lib/chart-config";

const data = {
  labels: ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5", "Race 6"],
  datasets: [
    {
      label: "Pourchaire",
      data: [25, 44, 58, 83, 95, 108],
      borderColor: "#FF3366",
      backgroundColor: "rgba(255, 51, 102, 0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "Vesti",
      data: [18, 36, 52, 71, 89, 96],
      borderColor: "#3366FF",
      backgroundColor: "rgba(51, 102, 255, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Points",
      },
    },
  },
};

export function ChampionshipOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Championship Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}