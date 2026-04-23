import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
export const description = "A radial chart with text";

export function CircleChart({
  chartData,
}: {
  chartData: [
    {
      dataKey: string;
      value: string;
      fill: string;
      numericValue: number;
      endAngle: number;
    },
  ];
}) {
  const configKey = chartData[0].dataKey.toLowerCase().replace(/\s+/g, "_");
  const rechartsData = [
    {
      [chartData[0].dataKey]: chartData[0].numericValue,
      fill: chartData[0].fill,
    },
  ];

  return (
    <div className="h-85 w-[320px]">
      <Card className="w-full h-full gap-0">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={{
              [configKey]: {
                label: chartData[0].dataKey,
                color: chartData[0].fill,
              },
            }}
            className="mx-auto aspect-square max-h-62.5"
          >
            <RadialBarChart
              data={rechartsData}
              startAngle={90}
              endAngle={-chartData[0].endAngle}
              innerRadius={84}
              outerRadius={150}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[97, 70]}
                fill={chartData[0].fill}
              />
              <RadialBar
                dataKey={chartData[0].dataKey}
                background
                cornerRadius={20}
                fill={`var(--color-${configKey})`}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-[28px] font-bold"
                          >
                            {chartData[0].value}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full font-semibold text-[18px]">
            {chartData[0].dataKey}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
