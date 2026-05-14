import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useUpdateNotes } from "@/hooks/use-animals";

interface CustomTextareaProps {
  animalId: string;
  initialNotes?: string;
}

export function CustomTextarea({
  animalId,
  initialNotes = "",
}: CustomTextareaProps) {
  const [text, setText] = useState<string>(initialNotes);
  const [edit, setEdit] = useState<boolean>(false);
  const updateNotes = useUpdateNotes(animalId);

  useEffect(() => {
    setText(initialNotes);
  }, [initialNotes]);

  const handleSave = () => {
    updateNotes.mutate(text);
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
              variant="destructive"
              className="bg-[#DC2626] text-[#FFFFFF] font-medium h-fit py-1.5 px-4 text-[11px] cursor-pointer md:px-6 md:py-2 md:text-[16px]"
            >
              Save
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
