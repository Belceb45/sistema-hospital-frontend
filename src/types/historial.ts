export interface HistorialMedico{
    id?: string;
    pacienteId: string;
    // Antecedentes (Switches)
    diabetes: boolean;
    hipertension: boolean;
    asma: boolean;
    enfermedadesCardiacas: boolean;
    obesidad: boolean;
    // Detalles (Texto)
    alergias: string;
    cirugiasPrevias: string;
    antecedentesFamiliares: string;
    // Generales
    tipoSangre: string;
    urlExpediente?:string;
}