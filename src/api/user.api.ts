import { API_BASE_URL } from "./config";

export const USER_API = {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/actualizar/${id}`,
    UPDATEDOCTOR:(id:string)=>`${API_BASE_URL}/users/actualizar/doctor/${id}`,
    RESULTS:(id:string)=>`${API_BASE_URL}/resultados/paciente/${id}`,
    HISTORIAL:(id:string)=>`${API_BASE_URL}/historial/${id}`,
    GUARDAR_HISTORIAL:`${API_BASE_URL}/historial/guardar`
}