"use client";

import Link from "next/link";
import Button from "./Button";
import { Edit3, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { useState } from "react";

interface TaskItemProps {
    task: Task;
    onDelete?: () => void;
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
    const [loading, setLoading] = useState(false);

    return (
        <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900/80 transition rounded-xl border border-zinc-800 bg-zinc-900 mb-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-zinc-100 truncate">{task.title}</span>
                </div>
                {task.description && (
                    <p className="text-zinc-400 text-sm">{task.description}</p>
                )}
                <p className="text-xs text-zinc-500 mt-1">
                    Criada em: {new Date(task.createdAt).toLocaleString()}
                </p>
            </div>
            <div className="flex gap-2">
                <Link href={`/tasks/${task.id}`}>
                    <Button variant="secondary" className="min-w-[90px] px-3 py-1.5">
                        <Edit3 size={16} />
                        Editar
                    </Button>
                </Link>
                <Button
                    variant="danger"
                    className="min-w-[90px] px-3 py-1.5"
                    confirm
                    confirmTitle="Confirmar exclusão?"
                    confirmMessage="Esta ação não pode ser desfeita."
                    onConfirm={onDelete}
                    loading={loading}
                >
                    <Trash2 size={16} />
                    Excluir
                </Button>
            </div>
        </li>
    );
}