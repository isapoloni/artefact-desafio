import { appRouter } from '@/server/api/root';
import { createContext } from '@/server/context';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Task } from '@/types/task';
import DeleteButton from '@/components/DeleteButton';

export default async function TarefasPage() {
    const caller = appRouter.createCaller(await createContext());

    let taskList: Task[] = [];

    try {
        taskList = await caller.tasks.list();
    } catch (error) {
        notFound();
    }

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
                <Link href="/tasks/new" className="text-blue-500 underline">+ Nova Tarefa</Link>
            </div>

            {taskList.length === 0 ? (
                <p>Nenhuma tarefa encontrada.</p>
            ) : (
                <ul className="space-y-4">
                        {taskList.map((task) => (
                        <li key={task.id} className="border p-4 rounded shadow">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">{task.title}</h2>
                                    {task.description && <p className="text-gray-600">{task.description}</p>}
                                    <p className="text-sm text-gray-500">
                                        Criada em: {new Date(task.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <Link
                                        href={`/tasks/${task.id}`}
                                        className="text-blue-600 underline text-sm"
                                    >
                                        Editar
                                    </Link>
                                    <DeleteButton id={task.id} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
