'use client';

import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
    mode: 'create' | 'edit';
    task?: {
        id: string;
        title: string;
        description?: string;
    };
};

export default function TasksForm({ mode, task }: Props) {
    const router = useRouter();

    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const create = trpc.tasks.create.useMutation({
        onSuccess: () => {
            setSuccess('Task created successfully!');
            router.push('/tasks');
        },
        onError: (err) => setError(err.message),
    });

    const update = trpc.tasks.update.useMutation({
        onSuccess: () => {
            setSuccess('Task updated successfully!');
            router.push('/tasks');
        },
        onError: (err) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }

        if (mode === 'create') {
            create.mutate({ title, description });
        } else if (mode === 'edit' && task) {
            update.mutate({ id: task.id, title, description });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h2 className="text-xl font-semibold">
                {mode === 'create' ? 'New Task' : 'Edit Task'}
            </h2>

            <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                    className="border w-full px-3 py-1 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    className="border w-full px-3 py-1 rounded"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {mode === 'create' ? 'Create' : 'Save'}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
        </form>
    );
}