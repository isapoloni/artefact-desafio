
// Este arquivo implementa um endpoint paginado (cursor-based) para suportar o infinite scroll na listagem de tarefas.
// O comportamento de carregamento incremental pode ser testado na interface: ao rolar até o final da lista, novas tarefas são carregadas automaticamente, sem necessidade de recarregar a página.


import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { TRPCError } from "@trpc/server";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

// Array em memória para simulação
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
  // Lista todas as tarefas (sem paginação)
  list: publicProcedure.query(() => {
    return tasks;
  }),

  // Endpoint para infinite scroll (cursor-based pagination)
  infiniteList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      // Simula atraso de rede para facilitar visualização do loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      const limit = input.limit ?? 10;
      let startIndex = 0;

      // Busca o índice do cursor (última task carregada)
      if (input.cursor) {
        const index = tasks.findIndex((t) => t.id === input.cursor);
        if (index === -1) {
          // Cursor inválido, retorna vazio
          return { items: [], nextCursor: undefined };
        }
        startIndex = index + 1;
      }

      // Busca até limit+1 para saber se há próxima página
      const items = tasks.slice(startIndex, startIndex + limit + 1);
      let nextCursor: string | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Cria uma nova tarefa
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

  // Atualiza uma tarefa existente
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

  // Remove uma tarefa existente
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
