import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Trash,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NewFarmerModal } from "@/components/custom/new-farmer-modal";
import { ViewFarmerModal } from "@/components/custom/view-farmer-modal";
import { NewFarmModal } from "@/components/custom/new-farm-modal";
import { ViewFarmModal } from "@/components/custom/view-farm-modal";
import { DeleteDialog } from "@/components/custom/delete-dialog";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api";

export const Route = createFileRoute("/_layout/farmer-list")({
  component: FarmersPage,
});

type Farm = { id: number; name: string; location: string; zipcode: string };
type Farmer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  farms: Farm[];
  isExpanded?: boolean;
};

function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadFarmers = async () => {
    try {
      setIsLoading(true);
      const response = await authFetch("/api/manager/farmers");
      const data = await response.json();
      setFarmers(
        data.map((farmer: Farmer) => ({ ...farmer, isExpanded: false })),
      );
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const toggleExpand = (id: string) => {
    setFarmers(
      farmers.map((f) =>
        f.id === id ? { ...f, isExpanded: !f.isExpanded } : f,
      ),
    );
  };

  const filteredFarmers = farmers.filter((farmer) =>
    (farmer.first_name + " " + farmer.last_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="px-6 py-8 md:px-16 md:py-12 h-full overflow-y-auto flex flex-col items-center">
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-4xl font-bold mb-2 animate-fade-up text-center">
          Farmers
        </h1>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4 justify-between items-center animate-fade-up-delay-1">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for a farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
            <NewFarmerModal onSuccess={loadFarmers} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-up-delay-2">
              {filteredFarmers.map((farmer, i) => (
                <div
                  key={farmer.id}
                  style={{ animationDelay: `${0.05 * i + 0.2}s` }}
                  className="animate-fade-up border border-gray-300 rounded-lg overflow-hidden bg-white/70"
                >
                  <div
                    onClick={() => toggleExpand(farmer.id)}
                    className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      farmer.isExpanded
                        ? "bg-gray-100 border-b border-gray-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {farmer.isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 shrink-0" />
                      )}
                      <span className="font-bold text-lg text-gray-800 truncate">
                        {farmer.first_name + " " + farmer.last_name}
                      </span>
                      <span className="text-sm text-gray-500 font-normal hidden md:inline truncate">
                        {farmer.email}
                      </span>
                    </div>

                    <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity duration-200 shrink-0">
                      <ViewFarmerModal farmer={farmer} onSave={loadFarmers} />
                      <DeleteDialog
                        name={farmer.first_name + " " + farmer.last_name}
                        onConfirm={async () => {
                          await authFetch(`/api/manager/farmers/${farmer.id}`, {
                            method: "DELETE",
                          });
                          loadFarmers();
                        }}
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
                    </div>
                  </div>

                  {farmer.isExpanded && (
                    <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] md:grid-cols-[repeat(auto-fill,minmax(405px,1fr))] gap-3">
                        {(!farmer.farms || farmer.farms.length === 0) && (
                          <p className="text-muted-foreground col-span-full text-sm italic">
                            No farms registered yet.
                          </p>
                        )}
                        {farmer.farms?.map((farm) => (
                          <div key={farm.id} className="animate-fade-up">
                            <Card className="flex flex-row px-4 py-3 items-center justify-between hover:shadow-md transition-all duration-200">
                              <CardTitle className="text-base flex-1">
                                {farm.name}
                              </CardTitle>
                              <ViewFarmModal
                                farm={{
                                  ...farm,
                                  farmerId: farmer.id.toString(),
                                }}
                                onSave={loadFarmers}
                              />
                            </Card>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <NewFarmModal
                          farmerId={farmer.id.toString()}
                          onSuccess={loadFarmers}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredFarmers.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No farmers found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
