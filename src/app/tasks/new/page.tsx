import TarefaForm from '@/components/TasksForm';

export default function NovaTarefaPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-transparent">
            <TarefaForm mode="create" />
        </main>
    );
}
