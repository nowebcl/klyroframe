import { format, differenceInMinutes, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDateDDMMYYYY(date: Date | string) {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatTimeRemaining(fechaTermino: Date | string) {
    const hoy = new Date();
    const termino = new Date(fechaTermino);
    const diffMinutes = differenceInMinutes(termino, hoy);

    if (diffMinutes <= 0) return "0h 0m";

    const days = Math.floor(diffMinutes / (24 * 60));
    const hours = Math.floor((diffMinutes % (24 * 60)) / 60);
    const minutes = diffMinutes % 60;

    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
}

export function daysRemaining(fechaTermino: Date | string) {
    const hoy = new Date();
    const termino = new Date(fechaTermino);
    const diffMinutes = differenceInMinutes(termino, hoy);

    if (diffMinutes <= 0) return 0;

    // Return days as a decimal if needed, but for the progress text we'll use formatTimeRemaining
    return Math.max(0, Math.floor(diffMinutes / (24 * 60)));
}

export function calcProgress(fechaInicio: Date | string, fechaTermino: Date | string) {
    const hoy = new Date().getTime();
    const inicio = new Date(fechaInicio).getTime();
    const termino = new Date(fechaTermino).getTime();

    if (hoy <= inicio) return 0;
    if (hoy >= termino) return 100;

    const total = termino - inicio;
    const transcurrido = hoy - inicio;
    return Math.min(100, Math.max(0, (transcurrido / total) * 100));
}

export function isOverdue(fechaTermino: Date | string) {
    const hoy = new Date();
    const termino = new Date(fechaTermino);
    return isBefore(termino, hoy);
}

export function formatTimeElapsed(fechaInicio: Date | string) {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);

    if (isAfter(inicio, hoy)) return "Aún no inicia";

    const diffMinutes = differenceInMinutes(hoy, inicio);

    const days = Math.floor(diffMinutes / (24 * 60));
    const hours = Math.floor((diffMinutes % (24 * 60)) / 60);
    const minutes = diffMinutes % 60;

    if (days > 0) {
        return `${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (hours > 0) {
        return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
}
