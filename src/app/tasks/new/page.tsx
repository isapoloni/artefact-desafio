// src/app/tarefas/nova/page.tsx
import TarefaForm from '@/components/TasksForm';

export default function NovaTarefaPage() {
    return (
        <main className="p-6">
            <TarefaForm modo="criar" />
        </main>
    );
}
