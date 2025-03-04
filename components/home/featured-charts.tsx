"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDescription } from "@/components/ui/chart-description";
import { Line, Radar } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { featuredChartData } from "@/lib/chart-data";
import "@/lib/chart-config";

export function FeaturedCharts() {
  const { theme } = useTheme();
  const [options, setOptions] = useState({});
  const [key, setKey] = useState(0); // Add key for forcing re-render

  useEffect(() => {
    const updateOptions = () => {
      const textColor = theme === 'dark' ? '#fff' : '#000';
      const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

      setOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: textColor,
              padding: 20,
              font: {
                size: window.innerWidth <= 640 ? 10 : 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: window.innerWidth <= 640 ? 8 : 10,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: window.innerWidth <= 640 ? 8 : 10,
              },
            },
          },
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            grid: {
              color: gridColor,
              circular: true,
            },
            ticks: {
              stepSize: 20,
              color: textColor,
              backdropColor: 'transparent',
              font: {
                size: window.innerWidth <= 640 ? 8 : 10,
              },
            },
            pointLabels: {
              color: textColor,
              font: {
                size: window.innerWidth <= 640 ? 8 : 11,
              },
            },
            angleLines: {
              color: gridColor,
            },
          },
        },
      });
      setKey(prev => prev + 1); // Force re-render when options change
    };

    updateOptions();
    window.addEventListener('resize', updateOptions);
    return () => window.removeEventListener('resize', updateOptions);
  }, [theme]);

  return (
    <div className="chart-grid">
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Championship Progress</CardTitle>
          <ChartDescription>
            This graph shows how drivers accumulate points throughout the season. Each line represents a driver's total points after each race, helping you track their championship battle and momentum shifts.
          </ChartDescription>
        </CardHeader>
        <CardContent className="chart-content">
          <div className="chart-wrapper">
            <Line key={`line-${key}`} data={featuredChartData.points} options={options} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Driver Performance Analysis</CardTitle>
          <ChartDescription>
            A radar chart comparing drivers across five key performance areas. The larger the area covered, the stronger the overall performance. This visualization helps identify drivers' strengths and weaknesses in different aspects of racing.
          </ChartDescription>
        </CardHeader>
        <CardContent className="chart-content">
          <div className="chart-wrapper">
            <Radar key={`radar-${key}`} data={featuredChartData.performance} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}