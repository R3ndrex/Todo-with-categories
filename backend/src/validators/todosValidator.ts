import { z } from "zod";

export const paramsTodoSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
});
export const createTodoSchema = z.object({
    body: z.object({
        categoryId: z.uuid(),
        name: z.string().min(1),
    }),
});
