"use client";

import { useState } from "react";
import { PlusIcon, SaveIcon, Trash2Icon, XIcon, Edit2Icon } from "lucide-react";
import { createNote, updateNote, deleteNote } from "@/lib/actions";
import { toast } from "sonner";

interface Note {
    id: string;
    content: string;
    createdAt: Date | string;
}

interface NotesEditorProps {
    projectId: string;
    notes: Note[];
}

export default function NotesEditor({ projectId, notes }: NotesEditorProps) {
    const [newNote, setNewNote] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setLoading(true);
        const res = await createNote(projectId, newNote);
        if (!res?.error) {
            toast.success("Nota añadida");
            setNewNote("");
        } else {
            toast.error("Error al añadir nota");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        setLoading(true);
        const res = await updateNote(id, editingContent);
        if (!res?.error) {
            toast.success("Nota actualizada");
            setEditingId(null);
        } else {
            toast.error("Error al actualizar nota");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta nota?")) {
            setLoading(true);
            const res = await deleteNote(id);
            if (!res?.error) {
                toast.success("Nota eliminada");
            } else {
                toast.error("Error al eliminar nota");
            }
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAddNote} className="relative">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe una nueva nota..."
                    className="w-full px-6 py-6 bg-white border border-gray-100 rounded-3xl focus:outline-none focus:ring-[6px] focus:ring-black/5 min-h-[160px] shadow-sm text-sm leading-relaxed"
                />
                <button
                    type="submit"
                    disabled={loading || !newNote.trim()}
                    className="absolute bottom-6 right-6 bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>

            <div className="grid gap-6">
                {notes.length === 0 && (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 text-sm font-medium">Aún no hay notas en este proyecto.</p>
                    </div>
                )}
                {notes.map((note) => (
                    <div key={note.id} className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm group hover:shadow-md transition-shadow relative">
                        {editingId === note.id ? (
                            <div className="space-y-4">
                                <textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm min-h-[100px]"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleUpdate(note.id)} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                                        <SaveIcon className="w-4 h-4" /> Guardar cambios
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed mb-6">{note.content}</p>
                                <div className="flex justify-between items-center bg-gray-50/50 -mx-8 -mb-8 mt-2 p-6 rounded-b-[32px] border-t border-gray-50">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        {new Date(note.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(note.id);
                                                setEditingContent(note.content);
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-white transition-all"
                                        >
                                            <Edit2Icon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
