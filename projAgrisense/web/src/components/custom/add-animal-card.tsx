import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface AddAnimalCardProps {
  onClick?: () => void
}

export function AddAnimalCard({ onClick }: AddAnimalCardProps) {
  return (
    <Card
      onClick={onClick}
      className="
        w-[150px] h-[150px]
        flex items-center justify-center
        border border-dashed border-border
        bg-card
        cursor-pointer
        rounded-xl
        transition-all duration-200
        hover:shadow-md hover:-translate-y-1 hover:scale-[1.02]
      "
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 p-0 text-muted-foreground">
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Add Animal</span>
      </CardContent>
    </Card>
  )
}