import { CircleChart } from "@/components/custom/circle-chart";
import { CustomTextarea } from "@/components/custom/custom-textarea";
import { DashboardTable } from "@/components/custom/dashboard-table";
import { CustomLineChart } from "@/components/custom/line-chart";
import { VetModal } from "@/components/custom/vet-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLiveMetrics } from "@/hooks/use-live-metrics";
import { useMovement, useWeight } from "@/hooks/use-historical-data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useIsMobile();

  const live = useLiveMetrics("cow-001") as Record<string, unknown> | null;
  const movementData = useMovement("cow-001", "2026-01-01", "2026-12-31") as {
    bucket: string;
    total: number;
  }[];
  const weightData = useWeight("cow-001", "2026-01-01", "2026-12-31") as {
    bucket: string;
    avgWeight: number;
  }[];

  const temp = live ? Number(live.temperature) : 38.5;
  const hr = live ? Number(live.heartRate) : 72;
  const stress = live ? Number(live.stress) : 0;

  const tempStr = live ? `${temp}°C` : "--";
  const hrStr = live ? `${hr} bpm` : "--";
  const stressStr = live ? `${stress}` : "--";

  const movementChartData = movementData
    .map((d) => ({
      day: d.bucket.slice(0, 10).split("-").reverse().join("-"),
      movementTrend: d.total,
    }))
    .filter((_, i) => i % 7 === 0);
  const weightChartData = weightData.map((d) => ({
    week: d.bucket.slice(0, 10).split("-").reverse().join("-"),
    weightProgress: Math.round(Number(d.avgWeight) * 10) / 10,
  }));

  return (
    <div className="px-8 py-7 md:px-28 md:py-14 flex flex-col h-full overflow-hidden">
      <div className="shrink-0 relative flex flex-col items-center  mb-10 gap-20 md:flex-row md:gap-0 md:mb-12">
        <div className="md:-mt-15">
          <VetModal />
        </div>
        <div className="flex justify-center w-full">
          <div className="flex flex-row gap-6 md:gap-7 items-center">
            <span className="text-5xl font-bold w-full flex justify-center">
              Cow 1
            </span>
            <img src="/female.png" className="h-9 md:h-15" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-7.5 md:gap-16 px-1 pt-1 pb-4 [&::-webkit-scrollbar]:hidden">
        {!isMobile ? (
          <div className="flex flex-row gap-25 justify-center">
            <CircleChart
              chartData={[
                {
                  dataKey: "Temperature",
                  value: tempStr,
                  fill: "red",
                  numericValue: temp,
                  endAngle: 250,
                },
              ]}
            />
            <CircleChart
              chartData={[
                {
                  dataKey: "Heart Rate",
                  value: hrStr,
                  fill: "green",
                  numericValue: hr,
                  endAngle: 200,
                },
              ]}
            />
            <CircleChart
              chartData={[
                {
                  dataKey: "Stress",
                  value: stressStr,
                  fill: "blue",
                  numericValue: stress,
                  endAngle: 90,
                },
              ]}
            />
          </div>
        ) : (
          <div>
            <DashboardTable
              columns={[{ key: "metric" }, { key: "value" }]}
              rows={[
                {
                  metric: "Temperature",
                  value: { value: tempStr, color: "#10B981" },
                },
                {
                  metric: "Heart Rate",
                  value: { value: hrStr, color: "#EF4444" },
                },
                {
                  metric: "Stress",
                  value: { value: stressStr, color: "#3B82F6" },
                },
              ]}
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <CustomLineChart
            data={
              movementChartData.length
                ? movementChartData
                : [{ day: "--", movementTrend: 0 }]
            }
            xKey="day"
            yKey="movementTrend"
            title="Movement Trend"
            color="var(--chart-2)"
          />
          <CustomLineChart
            data={
              weightChartData.length
                ? weightChartData
                : [{ week: "--", weightProgress: 0 }]
            }
            xKey="week"
            yKey="weightProgress"
            title="Weight Progress"
            color="var(--chart-2)"
          />
        </div>
        <div>
          <CustomTextarea />
        </div>
      </div>
    </div>
  );
}
