"use client";

import { useState } from "react";
import { createTask, toggleTaskStatus, deleteTaskPermanent, addTaskComment } from "@/lib/actions";
import { CheckCircle2Icon, CircleIcon, PlusIcon, MessageSquareIcon, Trash2Icon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
import { isOverdue } from "@/lib/date";

interface TaskListProps {
    projectId: string;
    tasks: any[];
    projectDeadline: Date | string;
}

export default function TaskList({ projectId, tasks, projectDeadline }: TaskListProps) {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [commentingTaskId, setCommentingTaskId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setLoading(true);
        const res = await createTask(projectId, newTaskTitle);
        setLoading(false);

        if (res.success) {
            setNewTaskTitle("");
            toast.success("Tarea agregada");
        } else {
            toast.error("Error al agregar tarea");
        }
    };

    const handleToggle = async (taskId: string, currentStatus: string) => {
        const res = await toggleTaskStatus(projectId, taskId, currentStatus);
        if (!res.success) toast.error("Error al actualizar tarea");
    };

    const handleDelete = async (taskId: string) => {
        if (!confirm("¿Eliminar esta tarea?")) return;
        const res = await deleteTaskPermanent(projectId, taskId);
        if (res.success) toast.success("Tarea eliminada");
    };

    const handleAddComment = async (taskId: string) => {
        if (!newComment.trim()) return;
        const res = await addTaskComment(projectId, taskId, newComment);
        if (res.success) {
            setNewComment("");
            setCommentingTaskId(null);
            toast.success("Comentario agregado");
        }
    };

    const deadlineEnded = isOverdue(projectDeadline);

    return (
        <div className="space-y-6">
            <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Nueva tarea (ej: Diseño de Logo)"
                    className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center aspect-square"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => {
                    const isCompleted = task.status === "COMPLETED";
                    const isRed = deadlineEnded && !isCompleted;

                    return (
                        <div
                            key={task.id}
                            className={`relative group p-5 rounded-[24px] border transition-all ${isCompleted
                                    ? "bg-green-50/50 border-green-100"
                                    : isRed
                                        ? "bg-red-50/50 border-red-100"
                                        : "bg-yellow-50/50 border-yellow-100"
                                }`}
                        >
                            {/* Visual "Stick" Style Indicator */}
                            <div className={`absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full ${isCompleted ? "bg-green-500" : isRed ? "bg-red-500" : "bg-yellow-500"
                                }`} />

                            <div className="pl-4 flex flex-col h-full">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleToggle(task.id, task.status)}
                                            className={`mt-0.5 transition-colors ${isCompleted ? "text-green-600" : "text-gray-400 hover:text-black"
                                                }`}
                                        >
                                            {isCompleted ? <CheckCircle2Icon className="w-5 h-5 fill-green-100" /> : <CircleIcon className="w-5 h-5" />}
                                        </button>
                                        <span className={`text-sm font-black leading-tight ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className="hidden group-hover:flex items-center gap-1">
                                        <button
                                            onClick={() => setCommentingTaskId(commentingTaskId === task.id ? null : task.id)}
                                            className="p-1.5 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                                        >
                                            <MessageSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                {task.comments?.length > 0 && (
                                    <div className="mt-4 space-y-2 pl-8">
                                        {task.comments.map((comment: any) => (
                                            <div key={comment.id} className="text-[11px] font-bold text-gray-500 bg-white/50 p-2 rounded-xl border border-gray-100/50">
                                                {comment.content}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {commentingTaskId === task.id && (
                                    <div className="mt-4 pl-8 space-y-2 animate-in fade-in slide-in-from-top-1">
                                        <textarea
                                            autoFocus
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Escribe un comentario..."
                                            className="w-full p-3 text-[11px] font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                                            rows={2}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setCommentingTaskId(null)}
                                                className="text-[10px] font-black uppercase text-gray-400 hover:text-black"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleAddComment(task.id)}
                                                className="text-[10px] font-black uppercase text-black bg-white px-3 py-1 rounded-lg border border-gray-100 hover:bg-gray-50 shadow-sm"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isCompleted
                                            ? "text-green-600 bg-green-100/50"
                                            : isRed
                                                ? "text-red-600 bg-red-100/50"
                                                : "text-yellow-600 bg-yellow-100/50"
                                        }`}>
                                        {isCompleted ? "Listo" : isRed ? "Vencido" : "En proceso"}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-300">
                                        <ClockIcon className="w-3 h-3" />
                                        <span className="text-[9px] font-bold">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
