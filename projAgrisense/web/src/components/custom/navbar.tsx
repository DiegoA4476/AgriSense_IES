import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center px-6 md:px-28 bg-[#FFFFFF] w-full py-3 border border-[#E5E7EB] shadow-[0px_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="flex flex-row gap-3 items-center">
        <img src="/small-logo.png" height={40} />
        <span className="text-2xl font-bold w-full flex justify-center">
          AgriSense
        </span>
      </div>
      <Link to="/">
        <Button
          variant="destructive"
          className="bg-[#DC2626] px-6 py-5 cursor-pointer flex flex-row gap-2"
        >
          <LogOutIcon height={24} width={16} color="#FFFFFF" />
          <span className="font-medium text-[16px] text-[#FFFFFF]">
            Log Out
          </span>
        </Button>
      </Link>
    </div>
  );
}
