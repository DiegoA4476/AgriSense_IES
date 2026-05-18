import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useAnimalNotes, useUpdateAnimalNotes } from "@/hooks/use-animal-notes";

interface CustomTextareaProps {
  animalId: string;
}

export function CustomTextarea({ animalId }: CustomTextareaProps) {
  const [text, setText] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const { data } = useAnimalNotes(animalId);
  const updateAnimalNotes = useUpdateAnimalNotes();

  useEffect(() => {
    setText(data?.notes ?? "");
  }, [data?.notes]);

  const handleSave = async () => {
    await updateAnimalNotes.mutateAsync({ animalId, notes: text });
    setEdit(false);
  };

  return (
    <Card className="w-full p-6">
      <Field>
        <div className="flex flex-row justify-between font-semibold text-[11px] md:text-[18px]">
          <FieldLabel>Veterinary Notes</FieldLabel>
          {edit ? (
            <Button
              onClick={handleSave}
              disabled={updateAnimalNotes.isPending}
              variant="destructive"
              className="bg-[#DC2626] text-[#FFFFFF] font-medium h-fit py-1.5 px-4 text-[11px] cursor-pointer md:px-6 md:py-2 md:text-[16px]"
            >
              {updateAnimalNotes.isPending ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button
              onClick={() => setEdit(true)}
              className="bg-[#16A34A] text-[#FFFFFF] font-medium h-fit py-1.5 px-4 text-[11px] cursor-pointer md:px-6 md:py-2 md:text-[16px]"
            >
              Edit
            </Button>
          )}
        </div>
        <Textarea
          id="vet-notes"
          onChange={(e) => setText(e.target.value)}
          placeholder="Leave here your notes."
          value={text}
          disabled={!edit}
          className="min-h-32 text-[11px] md:text-[16px]"
        />
      </Field>
    </Card>
  );
}
