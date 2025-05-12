import { router } from "../trpc";
import { tasksRouter } from "./routers/tasks";

export const appRouter = router({
  tasks: tasksRouter,
});
export type AppRouter = typeof appRouter;
