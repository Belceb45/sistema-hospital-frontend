
export interface Cita {
  id: string;
  doctor: string;
  pacienteId: number | null;
  fecha: string;
  hora: string;
  estado: string;
}