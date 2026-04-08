import { createFileRoute } from "@tanstack/react-router";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { BarnModal } from "@/components/custom/barn-modal";
import { DeleteBarnModal } from "@/components/custom/delete-barn-modal";
import { useBarns, useCreateBarn, useDeleteBarn } from "@/hooks/use-barns";
import { useState } from "react";

export const Route = createFileRoute("/_layout/barns")({
  component: RouteComponent,
});

function RouteComponent() {
  const barns = useBarns();
  const createBarn = useCreateBarn();
  const deleteBarn = useDeleteBarn();
  const [search, setSearch] = useState("");

  const filtered = barns.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <BarnModal onSubmit={(name) => createBarn.mutate(name)} />
        </Field>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-2">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center">
              No barns found. Create one to get started!
            </p>
          ) : null}
          {filtered.map((barn) => (
            <Card key={barn.id} size="sm" className="flex flex-row px-4 justify-between items-center">
              <CardTitle className="w-fit">{barn.name}</CardTitle>
              <CardFooter className="p-0! gap-2">
                <DeleteBarnModal
                  barnName={barn.name}
                  onConfirm={() => deleteBarn.mutate(barn.id)}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}