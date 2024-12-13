export default function configs(labels, datasets) {
  return {
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Programs',
          data: datasets[0]?.data,  // Use the first dataset for the pie chart
          backgroundColor: datasets[0]?.backgroundColor,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            },
          },
        },
        legend: {
          position: "top",
          align: "center",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: {
              family: "Roboto, sans-serif",
              size: 12,
              // weight: "bold",
            },
            padding: 10,
          },
        },
      },
      elements: {
        arc: {
          borderWidth: 0, // Makes the pie chart without border
        },
      },
    },
  };
}
