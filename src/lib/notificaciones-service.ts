import type { Notificacion } from "../types/notificacion";
import { NOTI_API } from "../api/noti";

export async function fetchNotificaciones(pacienteId:string): Promise<Notificacion[]>{
    const res=await fetch(NOTI_API.RECIBIDA(pacienteId));
    if(!res.ok) return [];
    return res.json();

}

export async function marcarLeida(id:string){
    await fetch(NOTI_API.LEIDA(id),{method:"PUT"});
}