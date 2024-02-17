interface ChartData {
  labels: Array<string | number>;
  datasets: Array<{
    label: string;
    backgroundColor: string;
    data: Array<number>;
  }>;
}

export type { ChartData };
