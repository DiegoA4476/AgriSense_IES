import { Navbar } from "@/components/custom/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      <Outlet />
    </div>
  );
}
