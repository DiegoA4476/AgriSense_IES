import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Trash2, Loader2 } from "lucide-react";
import { NewFarmerModal } from "@/components/custom/new-farmer-modal";
import { ViewFarmerModal } from "@/components/custom/view-farmer-modal";
import { NewFarmModal } from "@/components/custom/new-farm-modal";
import { ViewFarmModal } from "@/components/custom/view-farm-modal";
import { authFetch } from "@/lib/api";

export const Route = createFileRoute("/_layout/farmer-list")({
  component: FarmersPage,
});

// Define your types based on your backend response
type Farm = { id: number; name: string; location: string; zipcode: string };
type Farmer = { id: string; first_name: string; last_name: string; email: string; farms: Farm[]; isExpanded?: boolean };

function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch real data on component mount
  const loadFarmers = async () => {
    try {
      setIsLoading(true);
      const response = await authFetch('/api/manager/farmers'); 
      const data = await response.json();
      
      const formattedData = data.map((farmer: Farmer) => ({
        ...farmer,
        isExpanded: false,
      }));
      
      setFarmers(formattedData);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
      // Handle error state as needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this farmer? This cannot be undone.")) {
      return;
    }

    try {
      await authFetch(`/api/manager/farmers/${id}`, {
        method: "DELETE",
      });
      loadFarmers();
    } catch (error) {
      console.error("Failed to delete farmer:", error);
      alert("Failed to delete farmer.");
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
    <div className="h-full w-full overflow-y-auto bg-[#f0f6fc] px-6 py-10 md:px-20 lg:px-40 font-sans flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#1e293b] mb-10 tracking-tight">
        Farmers
      </h1>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for a farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-400 rounded-md py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-700" />
          </div>
          {/* Ensure NewFarmerModal triggers a refetch when a user is successfully created */}
          <NewFarmerModal onSuccess={loadFarmers} /> 
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="border border-gray-300 rounded-lg overflow-hidden bg-[#f4f4f5]"
              >
                <div
                  onClick={() => toggleExpand(farmer.id)}
                  className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 transition-colors ${
                    farmer.isExpanded
                      ? "bg-[#e4e4e7] border-b border-gray-300"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                    {farmer.isExpanded ? (
                      <span className="font-mono text-xl leading-none -mt-1">
                        v
                      </span>
                    ) : (
                      <span className="font-mono text-xl leading-none -mt-1">
                        {">"}
                      </span>
                    )}
                    {farmer.first_name + " " + farmer.last_name}
                  </div>

                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                    <ViewFarmerModal
                      farmer={farmer}
                      onSave={loadFarmers} // Trigger refetch on edit
                    />
                    <button
                      className="bg-[#ef4444] hover:bg-red-600 text-white p-1.5 rounded transition-colors"
                      onClick={(e) => handleDelete(e, farmer.id.toString())}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {farmer.isExpanded && (
                  <div className="p-5 bg-[#f8fafc]">
                    <h3 className="font-semibold text-gray-700 mb-3 text-base">
                      Farms:
                    </h3>
                    <ul className="flex flex-col gap-2.5 mb-6">
                      {farmer.farms?.map((farm, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700 font-medium ml-4"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                          {farm.name}
                          <ViewFarmModal
                            farm={{ ...farm, farmerId: farmer.id.toString() }}
                            onSave={loadFarmers} // Trigger refetch on edit
                          />
                        </li>
                      ))}
                      {(!farmer.farms || farmer.farms.length === 0) && (
                        <li className="text-gray-500 italic ml-4">No farms registered yet.</li>
                      )}
                    </ul>
                    <div className="flex justify-end">
                      <NewFarmModal 
                        farmerId={farmer.id.toString()} 
                        onSuccess={loadFarmers} // Trigger refetch on farm creation
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
  );
}