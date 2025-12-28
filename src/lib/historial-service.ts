import type { HistorialMedico } from "../types/historial";
import { USER_API } from "../api/user.api";

//Obtiene el historial medico de un paciente por su ID
export async function fetchHistorial(pacienteId: string): Promise<HistorialMedico | null>{
    try{
        const res=await fetch(USER_API.HISTORIAL(pacienteId));
        if(res.status===204) return null;
        if(!res.ok) throw new Error("Error aal obtener el historial");
        return await res.json();
    }catch(error){
        console.log("Error en fetchHistorial",error);
        return null;
        
    }
}

//Guarda o actualiza el historial medico.

export async function guardarHistorial(historial:HistorialMedico): Promise<HistorialMedico|null> {
    const res=await fetch(USER_API.GUARDAR_HISTORIAL,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(historial),
    });
    if(!res.ok) throw new Error("Error al guardar el historial");
    
    return await res.json();
}