/// Function to create line charts

const createChart = (
  chartDataArray,
  chartTimeArray,
  BGC,
  BC,
  FC,
  AxisTitle,
  chartID
) => {
  const chartData = {
    labels: chartTimeArray,
    datasets: [
      {
        backgroundColor: BGC, //colour of data points
        borderColor: BC, //colour of curve
        fill: {
          target: "origin",
          above: FC, //colour of fill under curve
        },
        data: chartDataArray,
        borderWidth: 1.5,
        pointBorderWidth: 0.1,
        radius: 1.5,
      },
    ],
  };
  const chartConfig = {
    type: "line",
    data: chartData,
    options: {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
      scales: {
        y: {
          title: { display: true, text: AxisTitle },
          grid: { color: "rgb(255,255,255)", borderColor: "rgb(255,255,255)" },
          ticks: { font: { size: 10 } },
          min: 0,
        },
        x: {
          grid: { color: "rgb(255,255,255)", borderColor: "rgb(255,255,255)" },
          ticks: { maxTicksLimit: 12, maxRotation: 0, font: { size: 10 } },
        },
      },
    },
  };
  const dataChart = new Chart(chartID, chartConfig);
};

export { createChart };
