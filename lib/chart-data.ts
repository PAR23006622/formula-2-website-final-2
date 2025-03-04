export const chartColors = {
  primary: '#FF3366',
  secondary: '#3366FF',
  tertiary: '#33CC66',
  quaternary: '#FF9933',
  quinary: '#9933FF',
};

export const chartBackgrounds = {
  primary: 'rgba(255, 51, 102, 0.2)',
  secondary: 'rgba(51, 102, 255, 0.2)',
  tertiary: 'rgba(51, 204, 102, 0.2)',
  quaternary: 'rgba(255, 153, 51, 0.2)',
  quinary: 'rgba(153, 51, 255, 0.2)',
};

export const featuredChartData = {
  points: {
    labels: ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5", "Race 6"],
    datasets: [
      {
        label: "Pourchaire",
        data: [25, 44, 58, 83, 95, 108],
        borderColor: chartColors.primary,
        backgroundColor: chartBackgrounds.primary,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Vesti",
        data: [18, 36, 52, 71, 89, 96],
        borderColor: chartColors.secondary,
        backgroundColor: chartBackgrounds.secondary,
        fill: true,
        tension: 0.4,
      },
    ],
  },
  performance: {
    labels: ["Qualifying", "Race Pace", "Overtaking", "Tire Management", "Wet Performance"],
    datasets: [
      {
        label: "Pourchaire",
        data: [95, 90, 85, 92, 88],
        borderColor: chartColors.primary,
        backgroundColor: chartBackgrounds.primary,
      },
      {
        label: "Vesti",
        data: [88, 92, 90, 85, 86],
        borderColor: chartColors.secondary,
        backgroundColor: chartBackgrounds.secondary,
      },
    ],
  },
};