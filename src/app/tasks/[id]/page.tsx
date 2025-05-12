'use client';

import TasksForm from '@/components/TasksForm';
import { trpc } from '@/lib/trpc/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTaskPage() {
    const { id } = useParams() as { id: string };
    const [task, setTask] = useState<{ id: string; title: string; description?: string }>();
    const { data, isLoading } = trpc.tasks.list.useQuery();
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) {
            const t = data.find((t) => t.id === id);
            if (!t) {
                setError('Task not found.');
            } else {
                setTask({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                });
            }
        }
    }, [data, id]);

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <main className="p-6">
            {task && <TasksForm mode="edit" task={task} />}
        </main>
    );
}