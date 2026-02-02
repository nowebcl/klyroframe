"use server";

import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { projectSchema } from "./validators";
import { revalidatePath } from "next/cache";

async function getSession() {
    return await getServerSession(authOptions);
}

export async function createProject(data: any) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        const validated = projectSchema.parse(data);

        await prisma.project.create({
            data: {
                nombreProyecto: validated.nombreProyecto,
                nombreCliente: validated.nombreCliente,
                whatsappCliente: validated.whatsappCliente,
                tipoProyecto: validated.tipoProyecto,
                descripcionMedida: validated.descripcionMedida,
                fechaInicio: validated.fechaInicio,
                fechaTermino: validated.fechaTermino,
                userId: (session.user as any).id,
                status: "ACTIVE",
            },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function finishProject(id: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.project.update({
            where: { id, userId: (session.user as any).id },
            data: {
                status: "FINISHED",
                deliveredAt: new Date(),
            },
        });

        revalidatePath("/");
        revalidatePath("/finished");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function createNote(projectId: string, content: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.note.create({
            data: {
                projectId,
                content,
                userId: (session.user as any).id,
            },
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateNote(id: string, content: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        const note = await prisma.note.update({
            where: { id, userId: (session.user as any).id },
            data: { content },
        });

        revalidatePath(`/projects/${note.projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteNote(id: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        const note = await prisma.note.delete({
            where: { id, userId: (session.user as any).id },
        });

        revalidatePath(`/projects/${note.projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function createTask(projectId: string, title: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.task.create({
            data: {
                projectId,
                title,
                status: "IN_PROGRESS",
            },
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function toggleTaskStatus(projectId: string, taskId: string, currentStatus: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: currentStatus === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED",
            },
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteTaskPermanent(projectId: string, taskId: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.task.delete({
            where: { id: taskId },
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function addTaskComment(projectId: string, taskId: string, content: string) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        await prisma.taskComment.create({
            data: {
                taskId,
                content,
            },
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
