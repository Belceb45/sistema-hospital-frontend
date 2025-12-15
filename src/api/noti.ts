import { API_BASE_URL } from "./config";

export const NOTI_API={
    RECIBIDA:(id:string)=>`${API_BASE_URL}/notificaciones/paciente/${id}`,
    LEIDA:(id:string)=>`${API_BASE_URL}/notificaciones/leer/${id}`
}