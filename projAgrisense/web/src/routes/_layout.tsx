import { Navbar } from "@/components/custom/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import keycloak from "@/lib/keycloak";

export const Route = createFileRoute("/_layout")({
  beforeLoad: () => {
    if (!keycloak.authenticated) throw redirect({ to: "/" });
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
