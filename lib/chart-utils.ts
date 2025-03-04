// Common chart options
export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        padding: 20,
        boxWidth: 10,
        boxHeight: 10,
        font: {
          size: 11,
        },
        color: 'currentColor',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(128, 128, 128, 0.2)',
      },
      ticks: {
        font: {
          size: 10,
        },
        color: 'currentColor',
      },
      border: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
        maxRotation: 45,
        minRotation: 45,
        color: 'currentColor',
      },
      border: {
        display: false,
      },
    },
  },
};

// Common colors for charts
export const chartColors = {
  primary: '#FF3366',
  secondary: '#3366FF',
  tertiary: '#33CC66',
  quaternary: '#FF9933',
  quinary: '#9933FF',
};

// Common background colors with opacity
export const chartBackgrounds = {
  primary: 'rgba(255, 51, 102, 0.2)',
  secondary: 'rgba(51, 102, 255, 0.2)',
  tertiary: 'rgba(51, 204, 102, 0.2)',
  quaternary: 'rgba(255, 153, 51, 0.2)',
  quinary: 'rgba(153, 51, 255, 0.2)',
};

// Responsive breakpoints for charts
export const getResponsiveOptions = (type: 'pie' | 'radar' | 'line' | 'polarArea' = 'line') => {
  const baseOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        display: window.innerWidth > 640,
      },
    },
  };

  if (type === 'pie' || type === 'polarArea') {
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins.legend,
          position: window.innerWidth <= 640 ? 'bottom' : 'right',
        },
      },
    };
  }

  return baseOptions;
};