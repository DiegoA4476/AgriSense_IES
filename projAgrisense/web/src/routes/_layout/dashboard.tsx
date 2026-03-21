import { CircleChart } from "@/components/custom/circle-chart";
import { CustomTextarea } from "@/components/custom/custom-textarea";
import { DashboardTable } from "@/components/custom/dashboard-table";
import { CustomLineChart } from "@/components/custom/line-chart";
import { VetModal } from "@/components/custom/vet-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useIsMobile();
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
      <div className="flex-1 overflow-y-auto flex flex-col gap-7.5 md:gap-16 px-1 pt-1 pb-4 [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:w-1 md:[&::-webkit-scrollbar-track]:bg-transparent md:[&::-webkit-scrollbar-thumb]:bg-gray-400 md:[&::-webkit-scrollbar-thumb]:rounded-full">
        {!isMobile ? (
          <div className="flex flex-row gap-25 justify-center">
            <CircleChart
              chartData={[
                {
                  dataKey: "Temperature",
                  value: "38.5°C",
                  fill: "red",
                  numericValue: 38,
                  endAngle: 250,
                },
              ]}
            />
            <CircleChart
              chartData={[
                {
                  dataKey: "Heart Rate",
                  value: "72 bpm",
                  fill: "green",
                  numericValue: 72,
                  endAngle: 200,
                },
              ]}
            />
            <CircleChart
              chartData={[
                {
                  dataKey: "Stress",
                  value: "38",
                  fill: "blue",
                  numericValue: 38,
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
                  value: { value: "38.5°C", color: "#10B981" },
                },
                {
                  metric: "Heart Rate",
                  value: { value: "72 bpm", color: "#EF4444" },
                },
                {
                  metric: "Stress",
                  value: { value: "78%", color: "#3B82F6" },
                },
              ]}
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <CustomLineChart
            data={[
              { day: "Mon", movementTrend: 38.2 },
              { day: "Tue", movementTrend: 38.5 },
              { day: "Wed", movementTrend: 38 },
              { day: "Thu", movementTrend: 38.8 },
              { day: "Fri", movementTrend: 39.2 },
              { day: "Sat", movementTrend: 38.6 },
              { day: "Sun", movementTrend: 38.5 },
              { day: "Mon", movementTrend: 38.2 },
              { day: "Tue", movementTrend: 38.5 },
              { day: "Wed", movementTrend: 38 },
              { day: "Thu", movementTrend: 38.8 },
              { day: "Fri", movementTrend: 39.2 },
              { day: "Sat", movementTrend: 38.6 },
              { day: "Sun", movementTrend: 38.5 },
            ]}
            xKey="day"
            yKey="movementTrend"
            title="Movement Trend"
            color="var(--chart-2)"
          />
          <CustomLineChart
            data={[
              { week: "Week 1", weightProgress: 520 },
              { week: "Week 2", weightProgress: 525 },
              { week: "Week 3", weightProgress: 530 },
              { week: "Week 4", weightProgress: 535 },
              { week: "Week 5", weightProgress: 540 },
              { week: "Week 6", weightProgress: 545 },
            ]}
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
