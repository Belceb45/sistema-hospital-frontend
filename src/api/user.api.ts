import { API_BASE_URL } from "./config";

export const USER_API = {
    REGISTER: `${API_BASE_URL}/api/users/register`,
    LOGIN: `${API_BASE_URL}/api/users/login`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/users/actualizar/${id}`,
    UPDATEDOCTOR:(id:string)=>`${API_BASE_URL}/api/users/actualizar/doctor/${id}`,
    RESULTS:(id:string)=>`${API_BASE_URL}/api//resultados/paciente/${id}`,
    HISTORIAL:(id:string)=>`${API_BASE_URL}/api//historial/${id}`,
    GUARDAR_HISTORIAL:`${API_BASE_URL}/api//historial/guardar`
}