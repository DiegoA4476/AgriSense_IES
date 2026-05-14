import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function CustomTextarea() {
  const [text, setText] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  return (
    <Card className="w-full p-6">
      <Field>
        <div className="flex flex-row justify-between font-semibold text-[11px] md:text-[18px]">
          <FieldLabel>Veterinary Notes</FieldLabel>
          {edit ? (
            <Button
              onClick={() => setEdit(false)}
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
