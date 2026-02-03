"use server";

import { Resend } from 'resend';
import { headers } from 'next/headers';
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

export async function updateProject(id: string, data: any) {
    const session = await getSession();
    if (!session?.user || !(session.user as any).id) return { error: "Unauthorized" };

    try {
        const validated = projectSchema.parse(data);

        await prisma.project.update({
            where: { id, userId: (session.user as any).id },
            data: {
                nombreProyecto: validated.nombreProyecto,
                nombreCliente: validated.nombreCliente,
                whatsappCliente: validated.whatsappCliente,
                tipoProyecto: validated.tipoProyecto,
                descripcionMedida: validated.descripcionMedida,
                fechaInicio: validated.fechaInicio,
                fechaTermino: validated.fechaTermino,
            },
        });

        revalidatePath("/");
        revalidatePath(`/projects/${id}`);
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
export async function sendLoginNotification(email: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not defined. Skipping notification.");
        return { error: "API key missing" };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'IP desconocida';

    try {
        await resend.emails.send({
            from: 'Klyroframe <onboarding@resend.dev>',
            to: 'hola@noweb.cl',
            subject: '⚠️ Alerta de Inicio de Sesión - Klyroframe',
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #111;">
                    <h2 style="font-size: 24px; font-weight: 800; tracking: -0.05em;">Alerta de Acceso</h2>
                    <p>Se ha iniciado una nueva sesión en el sistema:</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 12px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Usuario:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Dirección IP:</strong> ${ip}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
                    </div>
                    <p style="font-size: 12px; color: #666;">Este es un mensaje automático generado por Klyroframe.</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: "Falló el envío de correo" };
    }
}

export async function verifyCaptcha(token: string) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) return { success: true }; // Skip if not configured to avoid blocking

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();
        return { success: data.success };
    } catch (error) {
        return { success: false };
    }
}
