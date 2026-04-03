import { createFileRoute } from "@tanstack/react-router";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card,  CardFooter, CardTitle } from "@/components/ui/card";
import { BarnModal } from "@/components/custom/barn-modal";
import { DeleteBarnModal } from "@/components/custom/delete-barn-modal";

export const Route = createFileRoute("/_layout/barns")({
  component: RouteComponent,
});

function RouteComponent() {
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
          <BarnModal/>
        </Field>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-2">
             <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 1</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <span className="top-2 right-2 h-4 w-4 rounded-full bg-destructive text-white text-[10px] font-medium flex items-center justify-center">3</span>
                    <DeleteBarnModal
                      barnName="Barn 1" onConfirm={function (): void {} }
                    />
                </CardFooter>
            </Card>
             <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 2</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <DeleteBarnModal
                      barnName="Barn 2" onConfirm={function (): void {} }
                    />
                </CardFooter>
            </Card>
            <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 3</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <DeleteBarnModal
                      barnName="Barn 3" onConfirm={function (): void {} }
                    />
                </CardFooter>
            </Card>
            <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 4</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <DeleteBarnModal
                      barnName="Barn 4" onConfirm={function (): void {} }
                    />
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}