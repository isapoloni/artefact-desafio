'use client';

import { trpc } from '@/lib/trpc/client';
import TaskItem from '@/components/TaskItem';
import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

type Task = {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
};

type TasksPage = {
    items: Task[];
    nextCursor?: string;
};

interface TaskListProps {
    initialData: TasksPage;
}

export default function TaskListClient({ initialData }: TaskListProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = trpc.tasks.infiniteList.useInfiniteQuery(
        { limit: 10 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialData: {
                pages: [initialData],
                pageParams: [undefined],
            },
        }
    );

    const utils = trpc.useUtils();

    const deleteTask = trpc.tasks.delete.useMutation({
        onSuccess(deletedTask) {
            utils.tasks.infiniteList.setInfiniteData({ limit: 10 }, (data) => {
                if (!data) return data;
                return {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        items: page.items.filter((task) => task.id !== deletedTask.id),
                    })),
                };
            });
            toast.success("Tarefa excluída com sucesso!");
        },
    });

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleObserver: IntersectionObserverCallback = useCallback(
        (entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            observer.disconnect();
        };
    }, [handleObserver]);

    const tasks = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <div>
            {tasks.length === 0 && status === 'success' ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex justify-center items-center text-zinc-400 py-12 text-lg font-medium">
                    Nenhuma tarefa encontrada.
                </div>
            ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={() => deleteTask.mutate({ id: task.id })}
                        />
                    ))}
                </ul>
            )}
            <div ref={loadMoreRef} />
            {isFetchingNextPage && (
                <div className="text-center text-zinc-400 py-4">Carregando mais...</div>
            )}
        </div>
    );
}