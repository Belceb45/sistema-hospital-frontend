import type { ResultadoLab } from "../types/resultados";
import { USER_API } from "../api/user.api";


export async function fetchResultadosPaciente(pacienteId:string):Promise<ResultadoLab[]> {
    const res=await fetch(USER_API.RESULTS(pacienteId));
    if(!res.ok) return [];
    return res.json();
}