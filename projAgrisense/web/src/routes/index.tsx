import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import keycloak from "@/lib/keycloak";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!keycloak.authenticated) return;
    if (keycloak.hasRealmRole("farmer")) throw redirect({ to: "/farms" });
    if (keycloak.hasRealmRole("manager"))
      throw redirect({ to: "/farmer-list" });
  },
  component: Index,
});

function Index() {
  return (
    <div className="px-6.5 md:px-20 py-8 flex flex-col gap-12">
      <div className="relative flex flex-row animate-fade-up">
        <div className="flex justify-between md:justify-center w-full">
          <div className="flex flex-row gap-3 items-center">
            <img src="/small-logo.png" height={40} />
            <span className="text-2xl font-bold w-full flex justify-center">
              AgriSense
            </span>
          </div>
        </div>
        <Button
          onClick={() => keycloak.login()}
          className="bg-[#16A34A] text-[#FFFFFF] absolute right-0 px-6 py-5 font-medium text-[16px] cursor-pointer hover:bg-green-700 transition-colors"
        >
          Log In
        </Button>
      </div>
      <div className="flex flex-col items-center gap-3">
        <img src="/big-logo.png" height={96} className="animate-fade-up-delay-1" />
        <span className="text-4xl md:text-5xl font-bold animate-fade-up-delay-1">AgriSense</span>
        <span className="text-lg md:text-2xl max-w-4xl text-[#4B5563] text-center animate-fade-up-delay-2">
          The complete platform for farmers and barn management. Monitor your
          animals' health, track vital signs, and ensure optimal care with our
          advanced sensing technology.
        </span>
        <div className="mt-10 flex flex-col gap-8 md:flex-row animate-fade-up-delay-3">
          <CustomCard
            image="/health-monitoring.png"
            title="Health Monitoring"
            description="Real-time tracking of animal vital signs and health indicators for proactive care."
          />
          <CustomCard
            image="/data-analytics.png"
            title="Data Analytics"
            description="Advanced analytics and insights to optimize farm operations and animal welfare."
          />
          <CustomCard
            image="/smart-alerts.png"
            title="Smart Alerts"
            description="Instant notifications when animals need attention or veterinary care."
          />
        </div>
      </div>
    </div>
  );
}

const CustomCard = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) => {
  return (
    <Card className="max-w-90.5 px-11 py-8 shadow-[0px_10px_15px_0_rgba(0,0,0,0.10),0px_4px_6px_0_rgba(0,0,0,0.10)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col items-center gap-6">
        <img src={image} width={64} className="transition-transform duration-300 hover:scale-110" />
        <span className="font-semibold text-[20px] text-center">{title}</span>
        <span className="text-[16px] text-center text-[#4B5563]">
          {description}
        </span>
      </div>
    </Card>
  );
};
