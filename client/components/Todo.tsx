import { Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

export default function Todo({
  name,
  status,
  category,
  isPendingRemoval,
  onToggleDone,
  onDelete,
}: {
  name: string
  status: "UNDONE" | "DONE"
  category: string
  isPendingRemoval?: boolean
  onToggleDone: () => void
  onDelete: () => void
}) {
  const isDone = status === "DONE"

  return (
    <Card
      size="sm"
      className={cn(
        "border border-border shadow-none transition-opacity",
        isPendingRemoval && "opacity-60"
      )}
    >
      <CardHeader className="gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        <input
          type="checkbox"
          checked={isDone}
          onChange={onToggleDone}
          className="mt-1 size-4 accent-primary"
          aria-label={`Mark ${name} as done`}
        />
        <div className="min-w-0 space-y-1.5">
          <CardTitle className={cn(isDone && "text-muted-foreground line-through")}>
            {name}
          </CardTitle>
          <CardDescription>{category}</CardDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label={`Delete ${name}`}
        >
          <Trash2 />
        </Button>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Status</span>
        <span
          className={cn(
            "inline-flex h-7 items-center border px-3 text-xs font-semibold tracking-widest uppercase",
            isDone
              ? "border-border bg-muted text-muted-foreground"
              : "border-primary/30 bg-primary/10 text-primary"
          )}
        >
          {isDone ? "Done" : "Not done"}
        </span>
      </CardContent>
    </Card>
  )
}
