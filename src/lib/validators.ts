import { z } from "zod";
import { fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Santiago';

export const projectSchema = z.object({
    nombreProyecto: z.string().min(1, "El nombre del proyecto es obligatorio"),
    nombreCliente: z.string().min(1, "El nombre del cliente es obligatorio"),
    whatsappCliente: z.string().min(1, "El WhatsApp es obligatorio"),
    tipoProyecto: z.string().optional(),
    descripcionMedida: z.string().optional(),
    fechaInicio: z.preprocess((arg) => (typeof arg == "string" ? fromZonedTime(arg, TIMEZONE) : arg), z.date()),
    fechaTermino: z.preprocess((arg) => (typeof arg == "string" ? fromZonedTime(arg, TIMEZONE) : arg), z.date()),
});


export const noteSchema = z.object({
    content: z.string().min(1, "La nota no puede estar vacía"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
