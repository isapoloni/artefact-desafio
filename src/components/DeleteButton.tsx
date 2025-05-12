'use client';

import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter();
    const [error, setError] = useState('');
    const deleteMutation = trpc.tasks.delete.useMutation({
        onSuccess: () => {
            router.refresh();
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    return (
        <div className="flex flex-col items-end">
            <button
                className="text-red-600 text-sm"
                onClick={() => deleteMutation.mutate({ id })}
            >
                Excluir
            </button>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
