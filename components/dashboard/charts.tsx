"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const pointsProgressData = {
  labels: ['Race 1', 'Race 2', 'Race 3', 'Race 4', 'Race 5', 'Race 6'],
  datasets: [
    {
      label: 'Pourchaire',
      data: [25, 44, 58, 83, 95, 108],
      borderColor: 'hsl(var(--chart-1))',
      backgroundColor: 'hsl(var(--chart-1) / 0.1)',
      fill: true,
    },
    {
      label: 'Vesti',
      data: [18, 36, 52, 71, 89, 96],
      borderColor: 'hsl(var(--chart-2))',
      backgroundColor: 'hsl(var(--chart-2) / 0.1)',
      fill: true,
    },
  ],
};

const performanceData = {
  labels: ['Qualifying', 'Race Pace', 'Overtaking', 'Tire Management', 'Wet Performance'],
  datasets: [
    {
      label: 'Team Performance',
      data: [85, 78, 82, 90, 75],
      backgroundColor: 'hsl(var(--chart-1) / 0.8)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Championship Points Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={pointsProgressData} options={options} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={performanceData} options={options} />
        </CardContent>
      </Card>
    </div>
  );
}