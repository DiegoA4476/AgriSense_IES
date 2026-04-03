import { Card, CardContent } from "@/components/ui/card"

type Animal = {
  id: string
  name: string
  type: "pork" | "cow" | "sheep"
}

const animalEmoji = {
  pork: "🐷",
  cow: "🐮",
  sheep: "🐑",
}

export function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <Card className="w-[150px] h-[150px] cursor-pointer 
      bg-card border border-border 
      hover:shadow-lg hover:-translate-y-1 
      transition-all duration-200 rounded-xl">

      <CardContent className="flex flex-col items-center justify-center h-full gap-2">
        <div className="text-5xl">
          {animalEmoji[animal.type]}
        </div>

        <p className="flex justify-center w-full font-semibold text-[18px]">
          {animal.name}
        </p>
      </CardContent>
    </Card>
  )
}