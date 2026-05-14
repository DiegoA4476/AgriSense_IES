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
  yTickCount?: number;
  yDomain?: [number | string, number | string];
};

const fmt = (v: unknown) => {
  const n = Number(v);
  return n % 1 === 0 ? String(n) : n.toFixed(1);
};

export function CustomLineChart({
  data,
  xKey,
  yKey,
  title,
  color = "var(--chart-1)",
  yTickCount,
  yDomain,
}: CustomLineChartProps) {
  const chartConfig = { [yKey]: { color, label: title } } satisfies ChartConfig;
  const minValue = Math.min(...data.map((d) => Number(d[yKey])));
  const isMobile = useIsMobile();
  const domain: [number | string, number | string] = yDomain ?? [
    minValue,
    "auto",
  ];
  const isScrollable = data.length > 6;
  const scrollWidth = isScrollable ? data.length * 60 : undefined;

  if (!isScrollable) {
    return (
      <Card className="w-full">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ top: 20, left: isMobile ? -6 : 12, right: 12 }}
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
                tickCount={yTickCount}
                tickFormatter={fmt}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0];
                  return (
                    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="font-medium">
                        {title} : {point.value}
                      </div>
                      <div className="text-muted-foreground">
                        Time: {point.payload[xKey]}
                      </div>
                    </div>
                  );
                }}
              />
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
                margin={{ top: 20, left: 10, right: 0, bottom: 30 }}
              >
                <YAxis
                  className="text-[8px] md:text-sm"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={44}
                  domain={domain}
                  tickCount={yTickCount}
                  tickFormatter={fmt}
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

          <div
            className="overflow-x-auto flex-1"
            ref={(el) => {
              if (el) el.scrollLeft = el.scrollWidth;
            }}
          >
            <div style={{ width: scrollWidth, marginLeft: -6 }}>
              <ChartContainer
                config={chartConfig}
                className="h-41.5 md:h-88 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={data}
                  margin={{ top: 20, left: 15, right: 12, bottom: 0 }}
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
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0];
                      return (
                        <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="font-medium">{title}: {point.value}</div>
                          <div className="text-muted-foreground">Time: {point.payload[xKey]}</div>
                        </div>
                      );
                    }}
                  />
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
