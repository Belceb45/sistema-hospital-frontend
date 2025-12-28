export interface ResultadoLab{
    id: string;
    pacienteId: string;
    tipoEstudio: string;
    descripcion: string;
    fechaRealizacion: string;
    doctorSolicitante: string;
    urlArchivo: string;
      // Campos simulados para la UI 
    status?: "completed" | "pending" | "in-progress";
}