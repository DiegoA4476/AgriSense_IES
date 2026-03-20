import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

type DataPoint = Record<string, string | number>;

type CustomLineChartProps = {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  title: string;
  color?: string;
};

export function CustomLineChart({
  data,
  xKey,
  yKey,
  title,
  color = "var(--chart-1)",
}: CustomLineChartProps) {
  const chartConfig = {
    [yKey]: { color },
  } satisfies ChartConfig;

  const minValue = Math.min(...data.map((d) => Number(d[yKey])));
  const isMobile = useIsMobile();

  const scrollThreshold = 6;

  const pointWidth = 60;
  const isScrollable = data.length > scrollThreshold;
  const scrollWidth = isScrollable ? data.length * pointWidth : undefined;

  const domain: [number, string] = [minValue, "auto"];

  if (!isScrollable) {
    return (
      <Card className="w-full">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
                left: isMobile ? -6 : 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                className="text-[8px] md:text-sm"
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                className="text-[8px] md:text-sm"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={44}
                domain={domain}
              />
              {!isMobile && (
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
              )}
              <Line
                dataKey={yKey}
                type="natural"
                stroke={`var(--color-${yKey})`}
                strokeWidth={2}
                dot={{ fill: `var(--color-${yKey})` }}
                activeDot={{ r: isMobile ? 3 : 6 }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground text-[8px] md:text-sm"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="font-semibold text-[11px] md:text-[18px]">
            {title}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex w-full overflow-hidden">
          <div style={{ width: 44 }}>
            <ChartContainer config={chartConfig} className="h-41.5 md:h-88">
              <LineChart
                data={data}
                margin={{ top: 20, left: 0, right: 0, bottom: 30 }}
              >
                <YAxis
                  className="text-[8px] md:text-sm"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={44}
                  domain={domain}
                />
                <Line
                  dataKey={yKey}
                  stroke="transparent"
                  dot={false}
                  legendType="none"
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="overflow-x-auto flex-1">
            <div style={{ width: scrollWidth, marginLeft: -6 }}>
              <ChartContainer
                config={chartConfig}
                className="h-41.5 md:h-88 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={data}
                  margin={{
                    top: 20,
                    left: 15,
                    right: 12,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    className="text-[8px] md:text-sm"
                    dataKey={xKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis hide domain={domain} />
                  {!isMobile && (
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                  )}
                  <Line
                    dataKey={yKey}
                    type="natural"
                    stroke={`var(--color-${yKey})`}
                    strokeWidth={2}
                    dot={{ fill: `var(--color-${yKey})` }}
                    activeDot={{ r: isMobile ? 3 : 6 }}
                  >
                    <LabelList
                      position="top"
                      className="fill-foreground text-[8px] md:text-sm"
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-semibold text-[11px] md:text-[18px]">{title}</div>
      </CardFooter>
    </Card>
  );
}
