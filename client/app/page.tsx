"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ClipboardList, Loader2, Undo2 } from "lucide-react"

import Todo from "@/components/Todo"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"

type TodoStatus = "UNDONE" | "DONE"

type TodoItem = {
  id: string
  name: string
  status: TodoStatus
  categoryId: string | null
}

type Category = {
  id: string
  name: string
}

type PendingRemoval = {
  todo: TodoItem
  timeoutId: ReturnType<typeof setTimeout>
}

export default function Page() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRemovals, setPendingRemovals] = useState<
    Record<string, PendingRemoval>
  >({})
  const pendingRemovalsRef = useRef<Record<string, PendingRemoval>>({})

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  )
  const filteredTodos = useMemo(() => {
    if (selectedCategory === "all") {
      return todos
    }

    return todos.filter((todo) => todo.categoryId === selectedCategory)
  }, [selectedCategory, todos])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      try {
        const [todosResponse, categoriesResponse] = await Promise.all([
          api.get<{ data: TodoItem[] }>("/todos"),
          api.get<{ data: Category[] }>("/categories"),
        ])

        setTodos(todosResponse.data.data)
        setCategories(categoriesResponse.data.data)
      } catch {
        setError("Could not load todos. Check that the API is running.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    pendingRemovalsRef.current = pendingRemovals
  }, [pendingRemovals])

  useEffect(() => {
    return () => {
      Object.values(pendingRemovalsRef.current).forEach(({ timeoutId }) =>
        clearTimeout(timeoutId)
      )
    }
  }, [])

  const removePendingReminder = (id: string) => {
    setPendingRemovals((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const deleteTodo = async (id: string) => {
    setError(null)
    try {
      await api.delete(`/todos/${id}`)
      setTodos((current) => current.filter((todo) => todo.id !== id))
      const pending = pendingRemovalsRef.current[id]
      if (pending) {
        clearTimeout(pending.timeoutId)
        removePendingReminder(id)
      }
    } catch {
      setError("Could not delete todo. Try again.")
    }
  }

  const scheduleRemoval = (todo: TodoItem) => {
    const existing = pendingRemovalsRef.current[todo.id]
    if (existing) {
      clearTimeout(existing.timeoutId)
    }

    const timeoutId = setTimeout(() => {
      deleteTodo(todo.id)
    }, 5000)

    setPendingRemovals((current) => ({
      ...current,
      [todo.id]: { todo, timeoutId },
    }))
  }

  const toggleDone = async (todo: TodoItem) => {
    setError(null)

    if (todo.status === "DONE") {
      const pending = pendingRemovalsRef.current[todo.id]
      if (pending) {
        clearTimeout(pending.timeoutId)
        removePendingReminder(todo.id)
      }
    }

    try {
      const response = await api.patch<{ data: TodoItem }>(`/todos/${todo.id}`)
      const updatedTodo = response.data.data

      setTodos((current) =>
        current.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
      )

      if (updatedTodo.status === "DONE") {
        scheduleRemoval(updatedTodo)
      }
    } catch {
      setError("Could not update todo status. Try again.")
    }
  }

  const undoDone = async (id: string) => {
    const pending = pendingRemovalsRef.current[id]
    if (!pending) {
      return
    }

    clearTimeout(pending.timeoutId)
    removePendingReminder(id)
    setError(null)

    try {
      const response = await api.patch<{ data: TodoItem }>(`/todos/${id}`)
      const updatedTodo = response.data.data
      setTodos((current) =>
        current.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
      )
    } catch {
      setError("Could not undo the completed task. Try again.")
    }
  }

  const pendingRemovalList = Object.values(pendingRemovals)

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-8 pb-6 text-foreground sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Todo board
          </p>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Today&apos;s tasks
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Keep work, errands, and personal items grouped by category.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/create-todo">Create todo</Link>
        </Button>
      </header>

      <main className="bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTodos.length} visible task
              {filteredTodos.length === 1 ? "" : "s"}
            </p>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading tasks...
            </div>
          ) : filteredTodos.length ? (
            <section className="grid gap-4">
              {filteredTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  name={todo.name}
                  category={
                    todo.categoryId
                      ? (categoryNames.get(todo.categoryId) ?? "Uncategorized")
                      : "Uncategorized"
                  }
                  status={todo.status}
                  isPendingRemoval={!!pendingRemovals[todo.id]}
                  onToggleDone={() => toggleDone(todo)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ))}
            </section>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-10 text-center">
              <ClipboardList className="size-8 text-muted-foreground" />
              <div className="space-y-1">
                <h2 className="text-sm font-semibold uppercase tracking-widest">
                  No tasks
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create a task or choose another category.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {pendingRemovalList.length > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-2">
          {pendingRemovalList.map(({ todo }) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-3 border border-border bg-popover px-4 py-3 text-popover-foreground shadow-lg"
            >
              <p className="min-w-0 truncate text-sm">
                Completed &quot;{todo.name}&quot;. Removing in 5 seconds.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => undoDone(todo.id)}
              >
                <Undo2 />
                Undo
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
