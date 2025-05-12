'use client';

// Página de edição de tarefa. Busca a tarefa pelo id via trpc.tasks.list.
// Em produção, o ideal seria um endpoint específico para buscar uma única tarefa.

import TasksForm from '@/components/TasksForm';
import { trpc } from '@/lib/trpc/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTaskPage() {
    const { id } = useParams() as { id: string };
    const [task, setTask] = useState<{ id: string; title: string; description?: string } | null>(null);
    const { data, isLoading, isError } = trpc.tasks.list.useQuery();
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) {
            const found = data.find((t) => t.id === id);
            if (!found) {
                setError('Tarefa não encontrada.');
                setTask(null);
            } else {
                setTask({
                    id: found.id,
                    title: found.title,
                    description: found.description,
                });
                setError('');
            }
        }
    }, [data, id]);

    if (isLoading) return <p className="p-6">Carregando...</p>;
    if (isError) return <p className="p-6 text-red-600">Erro ao carregar tarefas.</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <main className="p-6">
            {task && <TasksForm mode="edit" task={task} />}
        </main>
    );
}   