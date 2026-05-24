"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Resolver, useForm, useWatch } from "react-hook-form"
import { z } from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"

type Category = {
  id: string
  name: string
}

const createTodoSchema = z.object({
  name: z.string().min(1, "Todo name is required"),
  categoryId: z.uuid("Select a valid category"),
})

type CreateTodoForm = z.infer<typeof createTodoSchema>

const createTodoResolver: Resolver<CreateTodoForm> = async (values) => {
  const result = createTodoSchema.safeParse(values)

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    }
  }

  return {
    values: {},
    errors: Object.fromEntries(
      result.error.issues.map((issue) => [
        issue.path[0],
        { type: issue.code, message: issue.message },
      ])
    ),
  }
}

export default function Page() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoForm>({
    resolver: createTodoResolver,
    defaultValues: {
      name: "",
      categoryId: "",
    },
  })
  const categoryId = useWatch({ control, name: "categoryId" })

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get<{ data: Category[] }>("/categories")
        setCategories(response.data.data)
        setValue("categoryId", response.data.data[0]?.id ?? "", {
          shouldValidate: true,
        })
      } catch {
        setLoadError("Could not load categories. Check that the API is running.")
      }
    }

    loadCategories()
  }, [setValue])

  const onSubmit = async (values: CreateTodoForm) => {
    setSubmitError(null)
    try {
      await api.post("/todos", values)
      router.push("/")
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setSubmitError("This category already has 5 tasks.")
        return
      }

      setSubmitError("Could not create todo. Check that the API is running.")
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="border-b border-border pb-6 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <CardTitle>Create todo</CardTitle>
            <CardDescription>
              Add a task and place it in the category where it belongs.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href="/">Back</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="todo-name">Name</FieldLabel>
                    <Input
                      id="todo-name"
                      placeholder="First todo"
                      aria-invalid={!!errors.name}
                      {...register("name")}
                    />
                    {errors.name && (
                      <FieldDescription className="text-destructive">
                        {errors.name.message}
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="todo-category">Category</FieldLabel>
                    <Select
                      value={categoryId}
                      onValueChange={(value) =>
                        setValue("categoryId", value, { shouldValidate: true })
                      }
                      disabled={!categories.length}
                    >
                      <SelectTrigger
                        id="todo-category"
                        className="w-full"
                        aria-invalid={!!errors.categoryId}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <FieldDescription className="text-destructive">
                        {errors.categoryId.message}
                      </FieldDescription>
                    )}
                    {loadError && (
                      <FieldDescription className="text-destructive">
                        {loadError}
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>

              {submitError && (
                <FieldDescription className="text-destructive">
                  {submitError}
                </FieldDescription>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !categories.length}
              >
                {isSubmitting ? "Creating..." : "Create todo"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
