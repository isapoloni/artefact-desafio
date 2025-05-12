'use client';

import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';

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
    const [loading, setLoading] = useState(false);

    const create = trpc.tasks.create.useMutation({
        onMutate: () => setLoading(true),
        onSettled: () => setLoading(false),
        onSuccess: () => {
            toast.success('Tarefa criada com sucesso!', { icon: <CheckCircle size={20} /> });
            router.push('/tasks');
        },
        onError: (err) => toast.error(err.message, { icon: <AlertCircle size={20} /> }),
    });

    const update = trpc.tasks.update.useMutation({
        onMutate: () => setLoading(true),
        onSettled: () => setLoading(false),
        onSuccess: () => {
            toast.success('Tarefa atualizada com sucesso!', { icon: <CheckCircle size={20} /> });
            router.push('/tasks');
        },
        onError: (err) => toast.error(err.message, { icon: <AlertCircle size={20} /> }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('O título é obrigatório.', { icon: <AlertCircle size={20} /> });
            return;
        }
        if (mode === 'create') {
            create.mutate({ title, description });
        } else if (mode === 'edit' && task) {
            update.mutate({ id: task.id, title, description });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow p-6 flex flex-col gap-6 max-w-lg mx-auto"
        >
            <h2 className="text-2xl font-bold flex items-center gap-2">
                {mode === 'create'
                    ? <CheckCircle size={22} className="text-blue-600" />
                    : <Loader2 size={22} className="text-blue-600" />}
                {mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'}
            </h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Título *</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título"
                    autoFocus
                    className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition"
                />
            </div>
            <div>
                <label htmlFor="desc" className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                    id="desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Descreva a tarefa (opcional)"
                    className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition"
                />
            </div>
            <Button
                type="submit"
                variant="primary"
                loading={loading}
            >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
        </form>
    );
}