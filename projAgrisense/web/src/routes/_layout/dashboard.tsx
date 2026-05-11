import { CircleChart } from "@/components/custom/circle-chart";
import { CustomTextarea } from "@/components/custom/custom-textarea";
import { DashboardTable } from "@/components/custom/dashboard-table";
import { CustomLineChart } from "@/components/custom/line-chart";
import { VetModal } from "@/components/custom/vet-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeartRate, useTemperature, useStress } from "@/hooks/use-live-metrics";
import { useMovementHistory, useWeightHistory } from "@/hooks/use-historical-data";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useIsMobile();
  const router = useRouter();

  const hrData     = useHeartRate("cow-001");
  const tempData   = useTemperature("cow-001");
  const stressData = useStress("cow-001");
  const movementData = useMovementHistory("cow-001", "2026-01-01", "2026-12-31") as {
    bucket: string;
    total: number;
  }[];
  const weightData = useWeightHistory("cow-001", "2026-01-01", "2026-12-31") as {
    bucket: string;
    avgWeight: number;
  }[];

  const temp   = tempData   ? Number(tempData.temperature)  : 38.5;
  const hr     = hrData     ? Number(hrData.heartRate)       : 72;
  const stress = stressData ? Number(stressData.stress)      : 0;

  const tempStr   = tempData   ? `${temp}°C`   : "--";
  const hrStr     = hrData     ? `${hr} bpm`   : "--";
  const stressStr = stressData ? `${stress}`   : "--";

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
    <div className="px-6 py-8 md:px-16 md:py-12 flex flex-col h-full overflow-hidden">
      <div className="shrink-0 flex flex-col items-center mb-8 gap-4 md:flex-row md:justify-between md:mb-10 animate-fade-up">
        <div>
          <Button
            variant="ghost"
            className="cursor-pointer text-gray-500 hover:text-gray-800 -ml-2"
            onClick={() => router.history.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Barn
          </Button>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <span className="text-4xl font-bold">Cow 1</span>
          <img src="/female.png" className="h-9 md:h-15" />
        </div>
        <div>
          <VetModal />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-8 md:gap-12 px-1 pt-1 pb-4 [&::-webkit-scrollbar]:hidden">
        <div className="animate-fade-up-delay-1">
          {!isMobile ? (
            <div className="flex flex-row gap-16 justify-center">
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
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-6 animate-fade-up-delay-2">
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
        <div className="animate-fade-up-delay-3">
          <CustomTextarea />
        </div>
      </div>
    </div>
  );
}
