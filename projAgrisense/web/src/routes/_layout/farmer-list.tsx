import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Eye, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { NewFarmerModal } from "@/components/custom/new-farmer-modal";
import { ViewFarmerModal } from "@/components/custom/view-farmer-modal";
import { NewFarmModal } from "@/components/custom/new-farm-modal";
import { ViewFarmModal } from "@/components/custom/view-farm-modal";

export const Route = createFileRoute("/_layout/farmer-list")({
  component: FarmersPage,
});

function FarmersPage() {
  const [farmers, setFarmers] = useState([
    { 
      id: 1, 
      first_name: "Farmer",
      last_name: "1", 
      email: "farmer1@ua.pt",
      isExpanded: false, 
      farms: [
        { id: 1, name: "Farm 1" , location: "Aveiro", zipcode: "1234-567"},
        { id: 2, name: "Farm 2" , location: "Aveiro", zipcode: "1234-567"}
      ] 
    },
    { 
      id: 2, 
      first_name: "Farmer",
      last_name: "2", 
      email: "farmer2@ua.pt",
      isExpanded: true, 
      farms: [
        { id: 3, name: "Farm 3" , location: "Aveiro", zipcode: "1234-567"}
      ] 
    },
    { 
      id: 3, 
      first_name: "Farmer",
      last_name: "3", 
      email: "farmer3@ua.pt",
      isExpanded: false, 
      farms: [
        { id: 4, name: "Farm 4" , location: "Aveiro", zipcode: "1234-567"},
        { id: 5, name: "Farm 5" , location: "Aveiro", zipcode: "1234-567"}
      ] 
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: number) => {
    setFarmers(
      farmers.map((f) => (f.id === id ? { ...f, isExpanded: !f.isExpanded } : f))
    );
  };

  const filteredFarmers = farmers.filter((farmer) =>
    //farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
    (farmer.first_name + " " + farmer.last_name).toLowerCase().includes(searchTerm.toLowerCase())
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
            <NewFarmerModal />
        </div>

        <div className="flex flex-col gap-4">
          {filteredFarmers.map((farmer) => (
              <div 
                key={farmer.id} 
                className="border border-gray-300 rounded-lg overflow-hidden bg-[#f4f4f5]"
              >
              <div
                onClick={() => toggleExpand(farmer.id)}
                className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 transition-colors ${
                  farmer.isExpanded ? "bg-[#e4e4e7] border-b border-gray-300" : ""
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                  {farmer.isExpanded ? (
                    <span className="font-mono text-xl leading-none -mt-1">v</span>
                  ) : (
                    <span className="font-mono text-xl leading-none -mt-1">{">"}</span>
                  )}
                  {farmer.first_name + " " + farmer.last_name}
                </div>

                <div className="flex gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                  <ViewFarmerModal 
                    farmer={farmer}
                    onSave={(updatedFarmer) => {
                      setFarmers(prevFarmers => 
                        prevFarmers.map(f => 
                          f.id === updatedFarmer.id 
                            ? { ...f, ...updatedFarmer }
                            : f
                        )
                      );
                    }}
                  />
                  <button 
                    className="bg-[#ef4444] hover:bg-red-600 text-white p-1.5 rounded transition-colors" 
                    onClick={(e) => e.stopPropagation()}
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
                    {farmer.farms.map((farm, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700 font-medium ml-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                        {farm.name}                        
                        <ViewFarmModal 
                          farm={farm}
                          onSave={(updatedFarm) => {
                            setFarmers(prevFarmers => 
                              prevFarmers.map(f => {
                                if (f.id === farmer.id) {
                                  return {
                                    ...f,
                                    farms: f.farms.map(fm => fm.id === updatedFarm.id ? { ...fm, ...updatedFarm } : fm)
                                  };
                                }
                                return f;
                              })
                            );
                          }} 
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <NewFarmModal></NewFarmModal>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>

      
    </div>
  )
}