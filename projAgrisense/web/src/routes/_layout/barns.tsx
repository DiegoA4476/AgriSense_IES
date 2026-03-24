import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
export const Route = createFileRoute("/_layout/barns")({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useIsMobile();
  return (
    <div className="px-8 py-7 md:px-28 md:py-14 flex flex-col h-full overflow-hidden">
      <div className="flex justify-center w-full mb-5 md:mb-10">
        <span className="text-5xl font-bold w-full flex justify-center">
          Barns
        </span>
      </div>
      <div className="flex flex-col gap-12 md:gap-14">
        <Field
          orientation="horizontal"
          className="flex flex-row justify-center w-full"
        >
          <Input
            type="search"
            placeholder="Search by name..."
            className="max-w-2xs md:max-w-188 bg-[#FFFFFF]"
          />
          <Button className="bg-[#16A34A] cursor-pointer">
            <Plus />
            {isMobile ? "" : "New Barn"}
          </Button>
        </Field>
        <div>
          <span>put cards here</span>
        </div>
      </div>
    </div>
  );
}
