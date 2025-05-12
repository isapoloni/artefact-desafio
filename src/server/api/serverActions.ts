import { tasks } from "./routers/tasks";

export async function fetchInitialTasks(limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const items = tasks.slice(0, limit + 1);
  let nextCursor: string | undefined = undefined;

  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem!.id;
  }

  return {
    items,
    nextCursor,
  };
}
