import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ChevronDown, Loader2, Trash } from "lucide-react";
import { useFarmerFarms } from "@/hooks/use-farms";
import {
  useBarnsByFarm,
  useCreateBarn,
  useDeleteBarn,
} from "@/hooks/use-barns";
import { BarnModal } from "@/components/custom/barn-modal";
import { DeleteDialog } from "@/components/custom/delete-dialog";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_layout/farms")({
  component: FarmsPage,
});

function FarmSection({
  farm,
}: {
  farm: { id: number; name: string; location: string };
}) {
  const [expanded, setExpanded] = useState(true);
  const barns = useBarnsByFarm(farm.id);
  const createBarn = useCreateBarn();
  const deleteBarn = useDeleteBarn();

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/70 animate-fade-up">
      <div
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <span className="font-bold text-lg text-gray-800">{farm.name}</span>
          {farm.location && (
            <span className="text-sm text-gray-500 font-normal">
              — {farm.location}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {barns.length} barn{barns.length !== 1 ? "s" : ""}
        </span>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] md:grid-cols-[repeat(auto-fill,minmax(405px,1fr))] gap-3">
            {barns.length === 0 && (
              <p className="text-muted-foreground col-span-full text-sm italic">
                No barns yet. Create one below.
              </p>
            )}
            {barns.map((barn, i) => (
              <div
                key={barn.id}
                style={{ animationDelay: `${0.05 * i}s` }}
                className="animate-fade-up"
              >
                <Card className="flex flex-row px-4 py-3 items-center justify-between hover:shadow-md transition-all duration-200">
                  <Link
                    to="/barn-page"
                    search={{ id: barn.id }}
                    className="no-underline flex-1"
                  >
                    <CardTitle className="text-base">{barn.name}</CardTitle>
                  </Link>
                  <DeleteDialog
                    name={barn.name}
                    onConfirm={() => deleteBarn.mutate(barn.id)}
                    isPending={deleteBarn.isPending}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <BarnModal
              onSubmit={(name) => createBarn.mutate({ name, farmId: farm.id })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FarmsPage() {
  const { farms, isLoading } = useFarmerFarms();
  const [search, setSearch] = useState("");

  const filtered = farms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-6 py-8 md:px-16 md:py-12 h-full overflow-y-auto flex flex-col items-center">
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-4xl font-bold mb-2 animate-fade-up text-center">
          My Farms
        </h1>

        <div className="flex flex-col gap-6">
          <div className="animate-fade-up-delay-1">
            <Input
              type="search"
              placeholder="Search farms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white w-full"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-10 animate-fade-up-delay-1">
              {farms.length === 0
                ? "No farms assigned yet."
                : "No farms match your search."}
            </p>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-up-delay-2">
              {filtered.map((farm) => (
                <FarmSection key={farm.id} farm={farm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
