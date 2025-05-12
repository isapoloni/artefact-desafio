'use client';

// Este componente implementa a listagem de tarefas com infinite scroll.
// O carregamento incremental é feito via IntersectionObserver, disparando fetchNextPage()
// sempre que o usuário rola até o final da lista.
// O backend retorna páginas de tarefas usando paginação cursor-based.
// O texto "Carregando mais..." aparece enquanto uma nova página está sendo buscada.

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import TaskItem from '@/components/TaskItem';
import { useRef, useEffect, useCallback } from 'react';

export default function TarefasPage() {
    // Hook para buscar tarefas com paginação infinita (infinite scroll)
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
        }
    );

    const utils = trpc.useUtils();

    // Atualiza o cache do infinite query ao excluir uma tarefa
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
        },
    });

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Memoize o callback para evitar recriação desnecessária do observer
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

    // Junta todas as páginas carregadas em um único array de tarefas
    const tasks = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <main className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Minhas Tarefas</h1>
                <Link
                    href="/tasks/new"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-6 py-2 font-semibold shadow hover:bg-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                    <PlusCircle size={20} /> Nova Tarefa
                </Link>
            </div>
            <div>
                {/* Exibe mensagem se não houver tarefas */}
                {tasks.length === 0 && status !== 'pending' ? (
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
                {/* Elemento observado para disparar o carregamento incremental */}
                <div ref={loadMoreRef} />
                {isFetchingNextPage && (
                    <div className="text-center text-zinc-400 py-4">Carregando mais...</div>
                )}
            </div>
        </main>
    );
}