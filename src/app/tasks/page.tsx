import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import TaskListClient from '@/components/TaskListClient';
import { fetchInitialTasks } from '@/server/api/serverActions';

export default async function TarefasPage() {
    const initialData = await fetchInitialTasks(10);

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

            <TaskListClient initialData={initialData} />
        </main>
    );
}