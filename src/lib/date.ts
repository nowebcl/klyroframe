import { format, differenceInMinutes, isBefore, isAfter } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';

const TIMEZONE = 'America/Santiago';

export function getChileTime() {
    return toZonedTime(new Date(), TIMEZONE);
}

export function formatDateDDMMYYYY(date: Date | string) {
    return formatInTimeZone(new Date(date), TIMEZONE, 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatTimeRemaining(fechaTermino: Date | string) {
    const hoy = getChileTime();
    const termino = toZonedTime(new Date(fechaTermino), TIMEZONE);
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
    const hoy = getChileTime();
    const termino = toZonedTime(new Date(fechaTermino), TIMEZONE);
    const diffMinutes = differenceInMinutes(termino, hoy);

    if (diffMinutes <= 0) return 0;

    return Math.max(0, Math.floor(diffMinutes / (24 * 60)));
}

export function calcProgress(fechaInicio: Date | string, fechaTermino: Date | string) {
    const hoy = getChileTime().getTime();
    const inicio = toZonedTime(new Date(fechaInicio), TIMEZONE).getTime();
    const termino = toZonedTime(new Date(fechaTermino), TIMEZONE).getTime();

    if (hoy <= inicio) return 0;
    if (hoy >= termino) return 100;

    const total = termino - inicio;
    const transcurrido = hoy - inicio;
    return Math.min(100, Math.max(0, (transcurrido / total) * 100));
}

export function isOverdue(fechaTermino: Date | string) {
    const hoy = getChileTime();
    const termino = toZonedTime(new Date(fechaTermino), TIMEZONE);
    return isBefore(termino, hoy);
}

export function formatTimeElapsed(fechaInicio: Date | string) {
    const hoy = getChileTime();
    const inicio = toZonedTime(new Date(fechaInicio), TIMEZONE);

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

