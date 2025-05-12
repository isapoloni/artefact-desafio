import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { TRPCError } from "@trpc/server";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

const tasks: Task[] = [];

const createTaskInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const updateTaskInput = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const deleteTaskInput = z.object({
  id: z.string(),
});

export const tasksRouter = router({
  list: publicProcedure.query(() => {
    return tasks;
  }),

  create: publicProcedure.input(createTaskInput).mutation(({ input }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return newTask;
  }),

  update: publicProcedure.input(updateTaskInput).mutation(({ input }) => {
    const task = tasks.find((t) => t.id === input.id);
    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task not found.",
      });
    }

    task.title = input.title;
    task.description = input.description;
    return task;
  }),

  delete: publicProcedure.input(deleteTaskInput).mutation(({ input }) => {
    const index = tasks.findIndex((t) => t.id === input.id);
    if (index === -1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task not found.",
      });
    }

    const [removed] = tasks.splice(index, 1);
    return removed;
  }),
});
