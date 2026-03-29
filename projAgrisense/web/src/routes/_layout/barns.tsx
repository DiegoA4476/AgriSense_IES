import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {  Plus, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card,  CardFooter, CardTitle } from "@/components/ui/card";

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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-2">
             <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 1</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <span className="top-2 right-2 h-4 w-4 rounded-full bg-destructive text-white text-[10px] font-medium flex items-center justify-center">3</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive bg-destructive/10 md:text-muted-foreground md:bg-transparent hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
            </Card>
             <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 2</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive bg-destructive/10 md:text-muted-foreground md:bg-transparent hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
            </Card>
            <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 3</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive bg-destructive/10 md:text-muted-foreground md:bg-transparent hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
            </Card>
            <Card size="sm" className="flex flex-row px-4 justify-between items-center">
                <CardTitle className="w-fit">Barn 4</CardTitle>
                <CardFooter className="p-0! gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive bg-destructive/10 md:text-muted-foreground md:bg-transparent hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
