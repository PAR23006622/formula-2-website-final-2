"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  BarElement,
  PolarAreaController,
  RadarController,
  PieController,
  LineController,
  BarController,
  ScatterController
} from 'chart.js';

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  RadarController,
  PieController,
  LineController,
  BarController,
  ScatterController
);

// Set default options
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

// Set default colors to respect system theme
ChartJS.defaults.color = '#64748b';
ChartJS.defaults.borderColor = 'rgba(226, 232, 240, 0.5)';

// Set default font
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';

// Set default legend style
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;

// Set default tooltip style
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
ChartJS.defaults.plugins.tooltip.titleColor = '#fff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#fff';
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.displayColors = true;
ChartJS.defaults.plugins.tooltip.boxPadding = 4;

// Export configured ChartJS instance
export default ChartJS;